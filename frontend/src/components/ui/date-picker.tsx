import * as React from "react"
import { cn } from "@/lib/utils"
import { Calendar, ChevronLeft, ChevronRight, X } from "lucide-react"
import { Button } from "./button"
import { Input } from "./input"

// Types
export interface DatePickerProps {
  value?: Date | null
  onChange?: (date: Date | null) => void
  placeholder?: string
  disabled?: boolean
  minDate?: Date
  maxDate?: Date
  format?: string
  className?: string
  inputClassName?: string
  // Features
  clearable?: boolean
  showTodayButton?: boolean
  // Localization
  locale?: string
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
}

export interface DateRangePickerProps {
  startDate?: Date | null
  endDate?: Date | null
  onChange?: (start: Date | null, end: Date | null) => void
  placeholder?: string
  disabled?: boolean
  minDate?: Date
  maxDate?: Date
  className?: string
}

// Helper functions
function formatDate(date: Date, format: string = "MMM dd, yyyy", locale: string = "en-US"): string {
  const options: Intl.DateTimeFormatOptions = {}
  
  if (format.includes("yyyy")) options.year = "numeric"
  if (format.includes("yy")) options.year = "2-digit"
  if (format.includes("MMMM")) options.month = "long"
  if (format.includes("MMM")) options.month = "short"
  if (format.includes("MM")) options.month = "2-digit"
  if (format.includes("dd")) options.day = "2-digit"
  if (format.includes("d")) options.day = "numeric"
  
  return date.toLocaleDateString(locale, options)
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number, weekStartsOn: number = 0): number {
  const firstDay = new Date(year, month, 1).getDay()
  return (firstDay - weekStartsOn + 7) % 7
}

function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

function isDateDisabled(date: Date, minDate?: Date, maxDate?: Date): boolean {
  if (minDate && date < new Date(minDate.setHours(0, 0, 0, 0))) return true
  if (maxDate && date > new Date(maxDate.setHours(23, 59, 59, 999))) return true
  return false
}

// Calendar Component
interface CalendarProps {
  value?: Date | null
  onChange?: (date: Date) => void
  minDate?: Date
  maxDate?: Date
  locale?: string
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
  className?: string
}

function CalendarMonth({
  value,
  onChange,
  minDate,
  maxDate,
  locale = "en-US",
  weekStartsOn = 0,
  className,
}: CalendarProps) {
  const today = new Date()
  const [viewDate, setViewDate] = React.useState(value || today)
  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()

  const daysInMonth = getDaysInMonth(year, month)
  const firstDayOffset = getFirstDayOfMonth(year, month, weekStartsOn)

  const prevMonth = () => {
    setViewDate(new Date(year, month - 1, 1))
  }

  const nextMonth = () => {
    setViewDate(new Date(year, month + 1, 1))
  }

  const weekDays = React.useMemo(() => {
    const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
    return [...days.slice(weekStartsOn), ...days.slice(0, weekStartsOn)]
  }, [weekStartsOn])

  const monthName = viewDate.toLocaleDateString(locale, { month: "long", year: "numeric" })

  return (
    <div className={cn("p-3", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={prevMonth}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium text-slate-900">{monthName}</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={nextMonth}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Week days */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {weekDays.map((day) => (
          <div
            key={day}
            className="h-8 flex items-center justify-center text-xs font-medium text-slate-500"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells for offset */}
        {Array.from({ length: firstDayOffset }).map((_, i) => (
          <div key={`empty-${i}`} className="h-8" />
        ))}
        {/* Day cells */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1
          const date = new Date(year, month, day)
          const isSelected = value && isSameDay(date, value)
          const isToday = isSameDay(date, today)
          const isDisabled = isDateDisabled(date, minDate, maxDate)

          return (
            <button
              key={day}
              type="button"
              onClick={() => !isDisabled && onChange?.(date)}
              disabled={isDisabled}
              className={cn(
                "h-8 w-8 rounded-full flex items-center justify-center text-sm transition-colors",
                isSelected
                  ? "bg-blue-600 text-white font-semibold"
                  : isToday
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : isDisabled
                  ? "text-slate-300 cursor-not-allowed"
                  : "text-slate-700 hover:bg-slate-100"
              )}
            >
              {day}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// Main DatePicker Component
export function DatePicker({
  value,
  onChange,
  placeholder = "Select date",
  disabled = false,
  minDate,
  maxDate,
  format = "MMM dd, yyyy",
  className,
  inputClassName,
  clearable = true,
  showTodayButton = true,
  locale = "en-US",
  weekStartsOn = 0,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)

  // Close on click outside
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

  const handleSelect = (date: Date) => {
    onChange?.(date)
    setIsOpen(false)
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange?.(null)
  }

  const handleToday = () => {
    const today = new Date()
    onChange?.(today)
    setIsOpen(false)
  }

  const displayValue = value ? formatDate(value, format, locale) : ""

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {/* Input */}
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={cn(
          "relative cursor-pointer",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <Input
          readOnly
          value={displayValue}
          placeholder={placeholder}
          disabled={disabled}
          className={cn("pr-10 cursor-pointer", inputClassName)}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {clearable && value && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="p-0.5 hover:bg-slate-200 rounded"
            >
              <X className="h-4 w-4 text-slate-400" />
            </button>
          )}
          <Calendar className="h-4 w-4 text-slate-400" />
        </div>
      </div>

      {/* Calendar Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-1 bg-white rounded-lg border border-slate-200 shadow-lg animate-in fade-in-0 zoom-in-95">
          <CalendarMonth
            value={value}
            onChange={handleSelect}
            minDate={minDate}
            maxDate={maxDate}
            locale={locale}
            weekStartsOn={weekStartsOn}
          />
          {showTodayButton && (
            <div className="border-t border-slate-100 p-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-full"
                onClick={handleToday}
              >
                Today
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Date Range Picker Component
export function DateRangePicker({
  startDate,
  endDate,
  onChange,
  placeholder = "Select date range",
  disabled = false,
  minDate,
  maxDate,
  className,
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [selecting, setSelecting] = React.useState<"start" | "end">("start")
  const containerRef = React.useRef<HTMLDivElement>(null)

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

  const handleSelect = (date: Date) => {
    if (selecting === "start") {
      onChange?.(date, endDate && date <= endDate ? endDate : null)
      if (!endDate || date > endDate) {
        setSelecting("end")
      }
    } else {
      if (startDate && date >= startDate) {
        onChange?.(startDate, date)
        setIsOpen(false)
        setSelecting("start")
      } else {
        onChange?.(date, null)
        setSelecting("end")
      }
    }
  }

  const displayValue =
    startDate && endDate
      ? `${formatDate(startDate, "MMM dd")} - ${formatDate(endDate, "MMM dd, yyyy")}`
      : startDate
      ? `${formatDate(startDate, "MMM dd, yyyy")} - ...`
      : ""

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={cn(
          "relative cursor-pointer",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <Input
          readOnly
          value={displayValue}
          placeholder={placeholder}
          disabled={disabled}
          className="pr-10 cursor-pointer"
        />
        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-1 bg-white rounded-lg border border-slate-200 shadow-lg">
          <div className="flex gap-2 p-2 border-b border-slate-100">
            <button
              className={cn(
                "flex-1 px-3 py-1.5 text-xs rounded-md transition-colors",
                selecting === "start"
                  ? "bg-blue-50 text-blue-700 font-medium"
                  : "text-slate-600 hover:bg-slate-50"
              )}
              onClick={() => setSelecting("start")}
            >
              Start: {startDate ? formatDate(startDate, "MMM dd") : "..."}
            </button>
            <button
              className={cn(
                "flex-1 px-3 py-1.5 text-xs rounded-md transition-colors",
                selecting === "end"
                  ? "bg-blue-50 text-blue-700 font-medium"
                  : "text-slate-600 hover:bg-slate-50"
              )}
              onClick={() => setSelecting("end")}
            >
              End: {endDate ? formatDate(endDate, "MMM dd") : "..."}
            </button>
          </div>
          <CalendarMonth
            value={selecting === "start" ? startDate : endDate}
            onChange={handleSelect}
            minDate={selecting === "end" && startDate ? startDate : minDate}
            maxDate={maxDate}
          />
        </div>
      )}
    </div>
  )
}

// Month Picker
export function MonthPicker({
  value,
  onChange,
  minDate,
  maxDate,
  placeholder = "Select month",
  disabled = false,
  className,
}: {
  value?: Date | null
  onChange?: (date: Date) => void
  minDate?: Date
  maxDate?: Date
  placeholder?: string
  disabled?: boolean
  className?: string
}) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [viewYear, setViewYear] = React.useState(value?.getFullYear() || new Date().getFullYear())
  const containerRef = React.useRef<HTMLDivElement>(null)

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ]

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

  const handleSelect = (monthIndex: number) => {
    const date = new Date(viewYear, monthIndex, 1)
    onChange?.(date)
    setIsOpen(false)
  }

  const displayValue = value
    ? value.toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : ""

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={cn(
          "relative cursor-pointer",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <Input
          readOnly
          value={displayValue}
          placeholder={placeholder}
          disabled={disabled}
          className="pr-10 cursor-pointer"
        />
        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-1 bg-white rounded-lg border border-slate-200 shadow-lg p-3 w-64">
          <div className="flex items-center justify-between mb-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setViewYear(viewYear - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">{viewYear}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setViewYear(viewYear + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {months.map((month, index) => {
              const date = new Date(viewYear, index, 1)
              const isSelected =
                value &&
                value.getFullYear() === viewYear &&
                value.getMonth() === index
              const isDisabled = isDateDisabled(date, minDate, maxDate)

              return (
                <button
                  key={month}
                  onClick={() => !isDisabled && handleSelect(index)}
                  disabled={isDisabled}
                  className={cn(
                    "px-3 py-2 text-sm rounded-md transition-colors",
                    isSelected
                      ? "bg-blue-600 text-white font-medium"
                      : isDisabled
                      ? "text-slate-300 cursor-not-allowed"
                      : "text-slate-700 hover:bg-slate-100"
                  )}
                >
                  {month}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default DatePicker
