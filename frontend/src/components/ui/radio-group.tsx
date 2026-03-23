import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { Circle } from "lucide-react"
import { cn } from "@/lib/utils"

// Base Radio Group
const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root> & {
    orientation?: "horizontal" | "vertical"
  }
>(({ className, orientation = "vertical", ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn(
        "flex gap-3",
        orientation === "vertical" ? "flex-col" : "flex-row flex-wrap",
        className
      )}
      {...props}
      ref={ref}
    />
  )
})
RadioGroup.displayName = "RadioGroup"

// Base Radio Item
export interface RadioGroupItemProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> {
  label?: string
  description?: string
  size?: "sm" | "md" | "lg"
}

const sizeClasses = {
  sm: {
    radio: "h-4 w-4",
    indicator: "h-2 w-2",
    label: "text-sm",
    description: "text-xs",
  },
  md: {
    radio: "h-5 w-5",
    indicator: "h-2.5 w-2.5",
    label: "text-sm",
    description: "text-xs",
  },
  lg: {
    radio: "h-6 w-6",
    indicator: "h-3 w-3",
    label: "text-base",
    description: "text-sm",
  },
}

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioGroupItemProps
>(({ className, label, description, size = "md", ...props }, ref) => {
  const id = React.useId()
  const sizes = sizeClasses[size]

  const radioElement = (
    <RadioGroupPrimitive.Item
      ref={ref}
      id={id}
      className={cn(
        "shrink-0 rounded-full border border-slate-300 bg-white transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "data-[state=checked]:border-blue-600",
        sizes.radio,
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <Circle
          className={cn("fill-blue-600 text-blue-600", sizes.indicator)}
        />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )

  if (label || description) {
    return (
      <div className="flex items-start gap-3">
        {radioElement}
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

  return radioElement
})
RadioGroupItem.displayName = "RadioGroupItem"

// Radio Group with Options Helper
export interface RadioOption {
  value: string
  label: string
  description?: string
  disabled?: boolean
}

export interface RadioGroupWithOptionsProps {
  options: RadioOption[]
  value?: string
  onChange?: (value: string) => void
  orientation?: "horizontal" | "vertical"
  size?: "sm" | "md" | "lg"
  name?: string
  className?: string
}

export function RadioGroupWithOptions({
  options,
  value,
  onChange,
  orientation = "vertical",
  size = "md",
  name,
  className,
}: RadioGroupWithOptionsProps) {
  return (
    <RadioGroup
      value={value}
      onValueChange={onChange}
      orientation={orientation}
      name={name}
      className={className}
    >
      {options.map((option) => (
        <RadioGroupItem
          key={option.value}
          value={option.value}
          label={option.label}
          description={option.description}
          disabled={option.disabled}
          size={size}
        />
      ))}
    </RadioGroup>
  )
}

// Radio Card Component
export interface RadioCardProps {
  value: string
  title: string
  description?: string
  icon?: React.ReactNode
  price?: string
  badge?: React.ReactNode
  disabled?: boolean
  className?: string
}

export function RadioCard({
  value,
  title,
  description,
  icon,
  price,
  badge,
  disabled,
  className,
}: RadioCardProps) {
  return (
    <RadioGroupPrimitive.Item
      value={value}
      disabled={disabled}
      className={cn(
        "relative flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all text-left w-full",
        "data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-50",
        "data-[state=unchecked]:border-slate-200 data-[state=unchecked]:hover:border-slate-300 data-[state=unchecked]:bg-white",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
    >
      <div className="mt-0.5 shrink-0 h-5 w-5 rounded-full border border-slate-300 bg-white flex items-center justify-center data-[state=checked]:border-blue-600">
        <RadioGroupPrimitive.Indicator>
          <Circle className="h-2.5 w-2.5 fill-blue-600 text-blue-600" />
        </RadioGroupPrimitive.Indicator>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          {icon && <span className="text-slate-600">{icon}</span>}
          <span className="font-medium text-slate-900">{title}</span>
          {badge}
        </div>
        {description && (
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        )}
      </div>

      {price && (
        <div className="shrink-0 text-right">
          <span className="font-semibold text-slate-900">{price}</span>
        </div>
      )}
    </RadioGroupPrimitive.Item>
  )
}

// Radio Card Group
export function RadioCardGroup({
  options,
  value,
  onChange,
  columns = 1,
  className,
}: {
  options: Array<{
    value: string
    title: string
    description?: string
    icon?: React.ReactNode
    price?: string
    badge?: React.ReactNode
    disabled?: boolean
  }>
  value?: string
  onChange?: (value: string) => void
  columns?: 1 | 2 | 3
  className?: string
}) {
  const gridClasses = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  }

  return (
    <RadioGroup
      value={value}
      onValueChange={onChange}
      className={cn("grid gap-3", gridClasses[columns], className)}
    >
      {options.map((option) => (
        <RadioCard
          key={option.value}
          value={option.value}
          title={option.title}
          description={option.description}
          icon={option.icon}
          price={option.price}
          badge={option.badge}
          disabled={option.disabled}
        />
      ))}
    </RadioGroup>
  )
}

// Segmented Radio (Button-style)
export interface SegmentedRadioProps {
  options: Array<{
    value: string
    label: string
    icon?: React.ReactNode
    disabled?: boolean
  }>
  value?: string
  onChange?: (value: string) => void
  size?: "sm" | "md" | "lg"
  fullWidth?: boolean
  className?: string
}

const segmentedSizes = {
  sm: "h-8 px-3 text-xs",
  md: "h-9 px-4 text-sm",
  lg: "h-10 px-5 text-sm",
}

export function SegmentedRadio({
  options,
  value,
  onChange,
  size = "md",
  fullWidth = false,
  className,
}: SegmentedRadioProps) {
  return (
    <RadioGroup
      value={value}
      onValueChange={onChange}
      orientation="horizontal"
      className={cn(
        "inline-flex items-center gap-0 bg-slate-100 p-1 rounded-lg",
        fullWidth && "w-full",
        className
      )}
    >
      {options.map((option) => (
        <RadioGroupPrimitive.Item
          key={option.value}
          value={option.value}
          disabled={option.disabled}
          className={cn(
            "inline-flex items-center justify-center gap-1.5 font-medium rounded-md transition-all",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:z-10",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "data-[state=checked]:bg-white data-[state=checked]:text-slate-900 data-[state=checked]:shadow-sm",
            "data-[state=unchecked]:text-slate-600 data-[state=unchecked]:hover:text-slate-900",
            segmentedSizes[size],
            fullWidth && "flex-1"
          )}
        >
          {option.icon}
          {option.label}
        </RadioGroupPrimitive.Item>
      ))}
    </RadioGroup>
  )
}

// Color Radio (for color selection)
export function ColorRadio({
  colors,
  value,
  onChange,
  size = "md",
  className,
}: {
  colors: Array<{
    value: string
    color: string
    label?: string
  }>
  value?: string
  onChange?: (value: string) => void
  size?: "sm" | "md" | "lg"
  className?: string
}) {
  const colorSizes = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10",
  }

  return (
    <RadioGroup
      value={value}
      onValueChange={onChange}
      orientation="horizontal"
      className={cn("flex gap-2", className)}
    >
      {colors.map((color) => (
        <RadioGroupPrimitive.Item
          key={color.value}
          value={color.value}
          title={color.label || color.value}
          className={cn(
            "rounded-full border-2 transition-all",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
            "data-[state=checked]:border-slate-900 data-[state=checked]:ring-2 data-[state=checked]:ring-white data-[state=checked]:ring-inset",
            "data-[state=unchecked]:border-transparent",
            colorSizes[size]
          )}
          style={{ backgroundColor: color.color }}
        />
      ))}
    </RadioGroup>
  )
}

export { RadioGroup, RadioGroupItem }
export default RadioGroup
