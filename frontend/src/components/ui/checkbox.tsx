import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

// Base Checkbox Component
export interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  label?: string
  description?: string
  size?: "sm" | "md" | "lg"
  indeterminate?: boolean
}

const sizeClasses = {
  sm: {
    checkbox: "h-4 w-4",
    icon: "h-3 w-3",
    label: "text-sm",
    description: "text-xs",
  },
  md: {
    checkbox: "h-5 w-5",
    icon: "h-3.5 w-3.5",
    label: "text-sm",
    description: "text-xs",
  },
  lg: {
    checkbox: "h-6 w-6",
    icon: "h-4 w-4",
    label: "text-base",
    description: "text-sm",
  },
}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, label, description, size = "md", indeterminate, checked, ...props }, ref) => {
  const id = React.useId()
  const sizes = sizeClasses[size]

  // Handle indeterminate state
  const checkboxState = indeterminate ? "indeterminate" : checked

  const checkboxElement = (
    <CheckboxPrimitive.Root
      id={id}
      ref={ref}
      checked={checkboxState}
      className={cn(
        "peer shrink-0 rounded border border-slate-300 bg-white transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white",
        "data-[state=indeterminate]:border-blue-600 data-[state=indeterminate]:bg-blue-600 data-[state=indeterminate]:text-white",
        sizes.checkbox,
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center">
        {indeterminate ? (
          <Minus className={sizes.icon} />
        ) : (
          <Check className={sizes.icon} />
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )

  if (label || description) {
    return (
      <div className="flex items-start gap-3">
        {checkboxElement}
        <div className="space-y-0.5">
          {label && (
            <label
              htmlFor={id}
              className={cn(
                "font-medium text-slate-900 cursor-pointer select-none",
                sizes.label
              )}
            >
              {label}
            </label>
          )}
          {description && (
            <p className={cn("text-slate-500", sizes.description)}>
              {description}
            </p>
          )}
        </div>
      </div>
    )
  }

  return checkboxElement
})

Checkbox.displayName = "Checkbox"

// Checkbox Group Component
export interface CheckboxGroupOption {
  value: string
  label: string
  description?: string
  disabled?: boolean
}

export interface CheckboxGroupProps {
  options: CheckboxGroupOption[]
  value?: string[]
  onChange?: (value: string[]) => void
  orientation?: "horizontal" | "vertical"
  size?: "sm" | "md" | "lg"
  name?: string
  className?: string
}

export function CheckboxGroup({
  options,
  value = [],
  onChange,
  orientation = "vertical",
  size = "md",
  name,
  className,
}: CheckboxGroupProps) {
  const handleChange = (optionValue: string, checked: boolean) => {
    const newValue = checked
      ? [...value, optionValue]
      : value.filter((v) => v !== optionValue)
    onChange?.(newValue)
  }

  return (
    <div
      role="group"
      className={cn(
        "flex gap-3",
        orientation === "vertical" ? "flex-col" : "flex-row flex-wrap",
        className
      )}
    >
      {options.map((option) => (
        <Checkbox
          key={option.value}
          name={name}
          checked={value.includes(option.value)}
          onCheckedChange={(checked) =>
            handleChange(option.value, checked as boolean)
          }
          label={option.label}
          description={option.description}
          disabled={option.disabled}
          size={size}
        />
      ))}
    </div>
  )
}

// Checkbox Card Component
export interface CheckboxCardProps {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  title: string
  description?: string
  icon?: React.ReactNode
  disabled?: boolean
  className?: string
}

export function CheckboxCard({
  checked,
  onCheckedChange,
  title,
  description,
  icon,
  disabled,
  className,
}: CheckboxCardProps) {
  const id = React.useId()

  return (
    <label
      htmlFor={id}
      className={cn(
        "relative flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all",
        checked
          ? "border-blue-600 bg-blue-50"
          : "border-slate-200 hover:border-slate-300 bg-white",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      <CheckboxPrimitive.Root
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        className={cn(
          "mt-0.5 shrink-0 h-5 w-5 rounded border border-slate-300 bg-white transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white"
        )}
      >
        <CheckboxPrimitive.Indicator className="flex items-center justify-center">
          <Check className="h-3.5 w-3.5" />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          {icon && <span className="text-slate-600">{icon}</span>}
          <span className="font-medium text-slate-900">{title}</span>
        </div>
        {description && (
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        )}
      </div>
    </label>
  )
}

// Checkbox Card Group
export function CheckboxCardGroup({
  options,
  value = [],
  onChange,
  columns = 1,
  className,
}: {
  options: Array<{
    value: string
    title: string
    description?: string
    icon?: React.ReactNode
    disabled?: boolean
  }>
  value?: string[]
  onChange?: (value: string[]) => void
  columns?: 1 | 2 | 3
  className?: string
}) {
  const handleChange = (optionValue: string, checked: boolean) => {
    const newValue = checked
      ? [...value, optionValue]
      : value.filter((v) => v !== optionValue)
    onChange?.(newValue)
  }

  const gridClasses = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  }

  return (
    <div className={cn("grid gap-3", gridClasses[columns], className)}>
      {options.map((option) => (
        <CheckboxCard
          key={option.value}
          checked={value.includes(option.value)}
          onCheckedChange={(checked) =>
            handleChange(option.value, checked as boolean)
          }
          title={option.title}
          description={option.description}
          icon={option.icon}
          disabled={option.disabled}
        />
      ))}
    </div>
  )
}

// Select All Checkbox
export function SelectAllCheckbox({
  totalCount,
  selectedCount,
  onChange,
  label = "Select all",
  className,
}: {
  totalCount: number
  selectedCount: number
  onChange?: (selectAll: boolean) => void
  label?: string
  className?: string
}) {
  const isAllSelected = selectedCount === totalCount && totalCount > 0
  const isIndeterminate = selectedCount > 0 && selectedCount < totalCount

  return (
    <Checkbox
      checked={isAllSelected}
      indeterminate={isIndeterminate}
      onCheckedChange={(checked) => onChange?.(checked as boolean)}
      label={`${label} (${selectedCount}/${totalCount})`}
      className={className}
    />
  )
}

export { Checkbox }
export default Checkbox
