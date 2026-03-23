import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"
import { cn } from "@/lib/utils"

export interface SwitchProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> {
  size?: "sm" | "md" | "lg"
  label?: string
  description?: string
}

const sizeClasses = {
  sm: {
    root: "h-4 w-7",
    thumb: "h-3 w-3 data-[state=checked]:translate-x-3",
  },
  md: {
    root: "h-5 w-9",
    thumb: "h-4 w-4 data-[state=checked]:translate-x-4",
  },
  lg: {
    root: "h-6 w-11",
    thumb: "h-5 w-5 data-[state=checked]:translate-x-5",
  },
}

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  SwitchProps
>(({ className, size = "md", label, description, ...props }, ref) => {
  const sizes = sizeClasses[size]
  const id = React.useId()

  const switchElement = (
    <SwitchPrimitives.Root
      id={id}
      className={cn(
        "peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-slate-200",
        sizes.root,
        className
      )}
      {...props}
      ref={ref}
    >
      <SwitchPrimitives.Thumb
        className={cn(
          "pointer-events-none block rounded-full bg-white shadow-lg ring-0 transition-transform",
          "data-[state=unchecked]:translate-x-0",
          sizes.thumb
        )}
      />
    </SwitchPrimitives.Root>
  )

  if (label || description) {
    return (
      <div className="flex items-start gap-3">
        {switchElement}
        <div className="space-y-0.5">
          {label && (
            <label
              htmlFor={id}
              className="text-sm font-medium text-slate-900 cursor-pointer"
            >
              {label}
            </label>
          )}
          {description && (
            <p className="text-sm text-slate-500">{description}</p>
          )}
        </div>
      </div>
    )
  }

  return switchElement
})

Switch.displayName = "Switch"

// Toggle Group Component
export interface ToggleOption {
  value: string
  label: string
  icon?: React.ReactNode
  disabled?: boolean
}

export interface ToggleGroupProps {
  options: ToggleOption[]
  value?: string
  onChange?: (value: string) => void
  size?: "sm" | "md" | "lg"
  variant?: "default" | "outline"
  className?: string
}

const toggleSizes = {
  sm: "h-7 px-2 text-xs",
  md: "h-8 px-3 text-sm",
  lg: "h-10 px-4 text-sm",
}

export function ToggleGroup({
  options,
  value,
  onChange,
  size = "md",
  variant = "default",
  className,
}: ToggleGroupProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-0.5 rounded-lg p-0.5",
        variant === "default" && "bg-slate-100",
        variant === "outline" && "border border-slate-200",
        className
      )}
    >
      {options.map((option) => {
        const isSelected = option.value === value

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => !option.disabled && onChange?.(option.value)}
            disabled={option.disabled}
            className={cn(
              "inline-flex items-center justify-center gap-1.5 font-medium rounded-md transition-all",
              toggleSizes[size],
              isSelected
                ? variant === "default"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "bg-blue-600 text-white"
                : "text-slate-600 hover:text-slate-900",
              option.disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            {option.icon}
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

// Simple Toggle Button
export interface ToggleButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  pressed?: boolean
  onPressedChange?: (pressed: boolean) => void
  size?: "sm" | "md" | "lg"
  variant?: "default" | "outline"
}

export function ToggleButton({
  pressed = false,
  onPressedChange,
  size = "md",
  variant = "default",
  className,
  children,
  ...props
}: ToggleButtonProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={pressed}
      onClick={() => onPressedChange?.(!pressed)}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 font-medium rounded-lg transition-all",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
        toggleSizes[size],
        pressed
          ? variant === "default"
            ? "bg-blue-600 text-white"
            : "border-2 border-blue-600 bg-blue-50 text-blue-700"
          : variant === "default"
          ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
          : "border border-slate-200 text-slate-700 hover:bg-slate-50",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

// On/Off Switch with labels
export function OnOffSwitch({
  value,
  onChange,
  onLabel = "On",
  offLabel = "Off",
  size = "md",
  disabled = false,
  className,
}: {
  value?: boolean
  onChange?: (value: boolean) => void
  onLabel?: string
  offLabel?: string
  size?: "sm" | "md" | "lg"
  disabled?: boolean
  className?: string
}) {
  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <span
        className={cn(
          "text-sm",
          !value ? "font-medium text-slate-900" : "text-slate-500"
        )}
      >
        {offLabel}
      </span>
      <Switch
        checked={value}
        onCheckedChange={onChange}
        size={size}
        disabled={disabled}
      />
      <span
        className={cn(
          "text-sm",
          value ? "font-medium text-slate-900" : "text-slate-500"
        )}
      >
        {onLabel}
      </span>
    </div>
  )
}

export { Switch }
export default Switch
