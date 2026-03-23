import React from "react"
import { Filter } from "lucide-react"
import { Combobox } from "@/components/ui/combobox"
import type { ComboboxOption } from "@/components/ui/combobox"

interface SearchableFilterProps {
  options: ComboboxOption[]
  value: string
  onChange: (value: string) => void
  label?: string
  placeholder?: string
  searchPlaceholder?: string
  width?: string
}

export const SearchableFilter: React.FC<SearchableFilterProps> = ({
  options,
  value,
  onChange,
  label = "Area:",
  placeholder = "Select area...",
  searchPlaceholder = "Search...",
  width = "220px",
}) => {
  return (
    <div 
      className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm transition-all hover:border-slate-300 focus-within:ring-2 focus-within:ring-blue-500/10"
      style={{ minWidth: width }}
    >
      <Filter className="w-4 h-4 text-slate-400" />
      {label && <span className="text-sm font-medium text-slate-600 whitespace-nowrap">{label}</span>}
      <Combobox 
        options={options}
        value={value}
        onChange={(val) => onChange(val as string)}
        placeholder={placeholder}
        searchPlaceholder={searchPlaceholder}
        className="w-full"
        inputClassName="border-0 shadow-none h-7 min-h-0 py-0 px-2 bg-transparent focus:ring-0 font-semibold text-slate-900 ring-0 ring-offset-0"
        clearable={false}
      />
    </div>
  )
}
