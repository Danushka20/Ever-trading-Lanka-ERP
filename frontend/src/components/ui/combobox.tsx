import * as React from "react"
import { cn } from "@/lib/utils"
import { Check, ChevronDown, X, Search, Loader2 } from "lucide-react"
import { Input } from "./input"
import { Badge } from "./badge"

// Types
export interface ComboboxOption {
  value: string
  label: string
  description?: string
  icon?: React.ReactNode
  disabled?: boolean
  group?: string
}

export interface ComboboxProps {
  options: ComboboxOption[]
  value?: string | string[]
  onChange?: (value: string | string[]) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  disabled?: boolean
  loading?: boolean
  multiple?: boolean
  searchable?: boolean
  clearable?: boolean
  creatable?: boolean
  onCreate?: (value: string) => void
  className?: string
  inputClassName?: string
  maxDisplayItems?: number
  // Async search
  onSearch?: (query: string) => void | Promise<void>
  // Grouping
  grouped?: boolean
}

// Helper to group options
function groupOptions(options: ComboboxOption[]): Map<string, ComboboxOption[]> {
  const groups = new Map<string, ComboboxOption[]>()
  
  options.forEach((option) => {
    const group = option.group || ""
    if (!groups.has(group)) {
      groups.set(group, [])
    }
    groups.get(group)!.push(option)
  })
  
  return groups
}

export function Combobox({
  options,
  value,
  onChange,
  placeholder = "Select option...",
  searchPlaceholder = "Search...",
  emptyText = "No options found",
  disabled = false,
  loading = false,
  multiple = false,
  searchable = true,
  clearable = true,
  creatable = false,
  onCreate,
  className,
  inputClassName,
  maxDisplayItems = 3,
  onSearch,
  grouped = false,
}: ComboboxProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [isOpen, setIsOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [highlightedIndex, setHighlightedIndex] = React.useState(0)

  // Normalize value to array
  const selectedValues = React.useMemo(() => {
    if (!value) return []
    return Array.isArray(value) ? value : [value]
  }, [value])

  // Filter options based on search
  const filteredOptions = React.useMemo(() => {
    if (!searchQuery.trim()) return options

    const query = searchQuery.toLowerCase()
    return options.filter(
      (option) =>
        option.label.toLowerCase().includes(query) ||
        option.value.toLowerCase().includes(query) ||
        option.description?.toLowerCase().includes(query)
    )
  }, [options, searchQuery])

  // Check if we should show create option
  const showCreateOption = React.useMemo(() => {
    if (!creatable || !searchQuery.trim()) return false
    const exists = options.some(
      (opt) => opt.value.toLowerCase() === searchQuery.toLowerCase()
    )
    return !exists
  }, [creatable, searchQuery, options])

  // Get selected option labels
  const selectedOptions = React.useMemo(() => {
    return selectedValues
      .map((val) => options.find((opt) => opt.value === val))
      .filter(Boolean) as ComboboxOption[]
  }, [selectedValues, options])

  // Close on click outside
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
        setSearchQuery("")
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  // Focus input when opened
  React.useEffect(() => {
    if (isOpen && searchable && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen, searchable])

  // Reset highlighted index when options change
  React.useEffect(() => {
    setHighlightedIndex(0)
  }, [filteredOptions.length])

  // Handle search
  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    if (onSearch) {
      await onSearch(query)
    }
  }

  // Handle select
  const handleSelect = (optionValue: string) => {
    if (multiple) {
      const newValues = selectedValues.includes(optionValue)
        ? selectedValues.filter((v) => v !== optionValue)
        : [...selectedValues, optionValue]
      onChange?.(newValues)
    } else {
      onChange?.(optionValue)
      setIsOpen(false)
      setSearchQuery("")
    }
  }

  // Handle create
  const handleCreate = () => {
    if (onCreate && searchQuery.trim()) {
      onCreate(searchQuery.trim())
      if (multiple) {
        const newValues = [...selectedValues, searchQuery.trim()]
        onChange?.(newValues)
      } else {
        onChange?.(searchQuery.trim())
        setIsOpen(false)
      }
      setSearchQuery("")
    }
  }

  // Handle clear
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange?.(multiple ? [] : "")
  }

  // Handle remove tag (for multiple)
  const handleRemoveTag = (optionValue: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const newValues = selectedValues.filter((v) => v !== optionValue)
    onChange?.(newValues)
  }

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        setIsOpen(true)
        e.preventDefault()
      }
      return
    }

    const optionCount = filteredOptions.length + (showCreateOption ? 1 : 0)

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setHighlightedIndex((prev) => (prev + 1) % optionCount)
        break
      case "ArrowUp":
        e.preventDefault()
        setHighlightedIndex((prev) => (prev - 1 + optionCount) % optionCount)
        break
      case "Enter":
        e.preventDefault()
        if (showCreateOption && highlightedIndex === filteredOptions.length) {
          handleCreate()
        } else if (filteredOptions[highlightedIndex]) {
          handleSelect(filteredOptions[highlightedIndex].value)
        }
        break
      case "Escape":
        setIsOpen(false)
        setSearchQuery("")
        break
    }
  }

  // Display value
  const displayValue = React.useMemo(() => {
    if (selectedOptions.length === 0) return ""
    if (!multiple) return selectedOptions[0].label

    if (selectedOptions.length <= maxDisplayItems) {
      return null // Will render tags instead
    }

    return `${selectedOptions.length} selected`
  }, [selectedOptions, multiple, maxDisplayItems])

  // Grouped options
  const groupedOptions = React.useMemo(() => {
    if (!grouped) return null
    return groupOptions(filteredOptions)
  }, [filteredOptions, grouped])

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {/* Trigger */}
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        tabIndex={disabled ? -1 : 0}
        className={cn(
          "min-h-10 px-3 py-2 flex items-center gap-2 border border-slate-200 rounded-lg bg-white cursor-pointer transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
          disabled && "opacity-50 cursor-not-allowed bg-slate-50",
          isOpen && "ring-2 ring-blue-500 border-blue-500",
          inputClassName
        )}
      >
        {/* Selected values display */}
        <div className="flex-1 flex items-center gap-1.5 flex-wrap min-w-0">
          {multiple && selectedOptions.length > 0 && selectedOptions.length <= maxDisplayItems ? (
            selectedOptions.map((option) => (
              <Badge
                key={option.value}
                variant="secondary"
                className="gap-1 h-6"
              >
                {option.label}
                <button
                  type="button"
                  onClick={(e) => handleRemoveTag(option.value, e)}
                  className="hover:bg-slate-300 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))
          ) : displayValue ? (
            <span className="text-sm text-slate-900 truncate">{displayValue}</span>
          ) : (
            <span className="text-sm text-slate-400">{placeholder}</span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          {loading && <Loader2 className="h-4 w-4 text-slate-400 animate-spin" />}
          {clearable && selectedValues.length > 0 && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="p-0.5 hover:bg-slate-200 rounded"
            >
              <X className="h-4 w-4 text-slate-400" />
            </button>
          )}
          <ChevronDown
            className={cn(
              "h-4 w-4 text-slate-400 transition-transform",
              isOpen && "rotate-180"
            )}
          />
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-lg border border-slate-200 shadow-lg overflow-hidden animate-in fade-in-0 zoom-in-95">
          {/* Search input */}
          {searchable && (
            <div className="p-2 border-b border-slate-100">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={searchPlaceholder}
                  className="w-full h-8 pl-8 pr-3 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          )}

          {/* Options list */}
          <div className="max-h-60 overflow-y-auto">
            {loading && filteredOptions.length === 0 ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-5 w-5 text-slate-400 animate-spin" />
              </div>
            ) : filteredOptions.length === 0 && !showCreateOption ? (
              <div className="py-6 text-center text-sm text-slate-500">
                {emptyText}
              </div>
            ) : grouped && groupedOptions ? (
              // Grouped rendering
              Array.from(groupedOptions.entries()).map(([group, groupOpts], groupIndex) => (
                <div key={group || "ungrouped"}>
                  {group && (
                    <div className="px-3 py-1.5 text-xs font-semibold text-slate-500 bg-slate-50 sticky top-0">
                      {group}
                    </div>
                  )}
                  {groupOpts.map((option, index) => {
                    const globalIndex = Array.from(groupedOptions.values())
                      .slice(0, groupIndex)
                      .reduce((acc, opts) => acc + opts.length, 0) + index
                    const isSelected = selectedValues.includes(option.value)
                    const isHighlighted = highlightedIndex === globalIndex

                    return (
                      <div
                        key={option.value}
                        onClick={() => !option.disabled && handleSelect(option.value)}
                        onMouseEnter={() => setHighlightedIndex(globalIndex)}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 cursor-pointer",
                          isHighlighted && "bg-slate-50",
                          isSelected && "bg-blue-50",
                          option.disabled && "opacity-50 cursor-not-allowed"
                        )}
                      >
                        {option.icon && <span className="shrink-0">{option.icon}</span>}
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-slate-900">{option.label}</div>
                          {option.description && (
                            <div className="text-xs text-slate-500 truncate">
                              {option.description}
                            </div>
                          )}
                        </div>
                        {isSelected && (
                          <Check className="h-4 w-4 text-blue-600 shrink-0" />
                        )}
                      </div>
                    )
                  })}
                </div>
              ))
            ) : (
              // Flat rendering
              <>
                {filteredOptions.map((option, index) => {
                  const isSelected = selectedValues.includes(option.value)
                  const isHighlighted = highlightedIndex === index

                  return (
                    <div
                      key={option.value}
                      onClick={() => !option.disabled && handleSelect(option.value)}
                      onMouseEnter={() => setHighlightedIndex(index)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 cursor-pointer",
                        isHighlighted && "bg-slate-50",
                        isSelected && "bg-blue-50",
                        option.disabled && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      {option.icon && <span className="shrink-0">{option.icon}</span>}
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-slate-900">{option.label}</div>
                        {option.description && (
                          <div className="text-xs text-slate-500 truncate">
                            {option.description}
                          </div>
                        )}
                      </div>
                      {isSelected && (
                        <Check className="h-4 w-4 text-blue-600 shrink-0" />
                      )}
                    </div>
                  )
                })}
                {/* Create option */}
                {showCreateOption && (
                  <div
                    onClick={handleCreate}
                    onMouseEnter={() => setHighlightedIndex(filteredOptions.length)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 cursor-pointer border-t border-slate-100",
                      highlightedIndex === filteredOptions.length && "bg-slate-50"
                    )}
                  >
                    <span className="text-sm text-blue-600">
                      Create "{searchQuery}"
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// Simple Autocomplete Component
export function Autocomplete({
  options,
  value,
  onChange,
  placeholder = "Type to search...",
  emptyText = "No results",
  disabled = false,
  loading = false,
  className,
  onSearch,
}: {
  options: ComboboxOption[]
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  emptyText?: string
  disabled?: boolean
  loading?: boolean
  className?: string
  onSearch?: (query: string) => void | Promise<void>
}) {
  const [inputValue, setInputValue] = React.useState(value || "")
  const [isOpen, setIsOpen] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    setInputValue(value || "")
  }, [value])

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  const filteredOptions = React.useMemo(() => {
    if (!inputValue.trim()) return options
    const query = inputValue.toLowerCase()
    return options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(query) ||
        opt.value.toLowerCase().includes(query)
    )
  }, [options, inputValue])

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)
    setIsOpen(true)
    if (onSearch) {
      await onSearch(newValue)
    }
  }

  const handleSelect = (option: ComboboxOption) => {
    setInputValue(option.label)
    onChange?.(option.value)
    setIsOpen(false)
  }

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div className="relative">
        <Input
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          disabled={disabled}
          className="pr-8"
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 animate-spin" />
        )}
      </div>

      {isOpen && filteredOptions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-lg border border-slate-200 shadow-lg max-h-60 overflow-y-auto">
          {filteredOptions.map((option) => (
            <div
              key={option.value}
              onClick={() => handleSelect(option)}
              className="px-3 py-2 text-sm cursor-pointer hover:bg-slate-50"
            >
              {option.label}
            </div>
          ))}
        </div>
      )}

      {isOpen && !loading && inputValue && filteredOptions.length === 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-lg border border-slate-200 shadow-lg py-6 text-center text-sm text-slate-500">
          {emptyText}
        </div>
      )}
    </div>
  )
}

export default Combobox
