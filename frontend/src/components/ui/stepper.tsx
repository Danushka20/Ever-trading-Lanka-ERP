import * as React from "react"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"
import { Check } from "lucide-react"

export interface Step {
  id: string | number
  title: string
  description?: string
  icon?: LucideIcon
  optional?: boolean
  error?: string
}

export interface StepperProps {
  steps: Step[]
  currentStep: number
  onStepClick?: (stepIndex: number) => void
  orientation?: "horizontal" | "vertical"
  variant?: "default" | "simple" | "circles" | "dots"
  size?: "sm" | "md" | "lg"
  clickable?: boolean
  showNumbers?: boolean
  className?: string
}

const sizeClasses = {
  sm: {
    circle: "h-6 w-6 text-xs",
    connector: "h-0.5",
    verticalConnector: "w-0.5 h-8",
    title: "text-xs",
    description: "text-xs",
    gap: "gap-2",
  },
  md: {
    circle: "h-8 w-8 text-sm",
    connector: "h-0.5",
    verticalConnector: "w-0.5 h-10",
    title: "text-sm",
    description: "text-xs",
    gap: "gap-3",
  },
  lg: {
    circle: "h-10 w-10 text-base",
    connector: "h-1",
    verticalConnector: "w-1 h-12",
    title: "text-base",
    description: "text-sm",
    gap: "gap-4",
  },
}

type StepStatus = "completed" | "current" | "upcoming" | "error"

function getStepStatus(stepIndex: number, currentStep: number, step: Step): StepStatus {
  if (step.error) return "error"
  if (stepIndex < currentStep) return "completed"
  if (stepIndex === currentStep) return "current"
  return "upcoming"
}

// Default Stepper
export function Stepper({
  steps,
  currentStep,
  onStepClick,
  orientation = "horizontal",
  variant = "default",
  size = "md",
  clickable = false,
  showNumbers = true,
  className,
}: StepperProps) {
  const sizes = sizeClasses[size]
  const isHorizontal = orientation === "horizontal"

  if (variant === "dots") {
    return <DotsStepper steps={steps} currentStep={currentStep} size={size} className={className} />
  }

  if (variant === "simple") {
    return (
      <SimpleStepper
        steps={steps}
        currentStep={currentStep}
        onStepClick={onStepClick}
        clickable={clickable}
        className={className}
      />
    )
  }

  return (
    <nav aria-label="Progress" className={className}>
      <ol
        className={cn(
          "flex",
          isHorizontal ? "items-center" : "flex-col"
        )}
      >
        {steps.map((step, index) => {
          const status = getStepStatus(index, currentStep, step)
          const isLast = index === steps.length - 1
          const Icon = step.icon

          return (
            <li
              key={step.id}
              className={cn(
                "flex",
                isHorizontal ? "flex-1 items-center" : "relative pb-8 last:pb-0"
              )}
            >
              {/* Vertical connector (left side) */}
              {!isHorizontal && !isLast && (
                <div
                  className={cn(
                    "absolute left-4 top-10 -ml-px",
                    sizes.verticalConnector,
                    status === "completed" ? "bg-blue-600" : "bg-slate-200"
                  )}
                />
              )}

              <div
                className={cn(
                  "flex items-center",
                  sizes.gap,
                  clickable && status !== "upcoming" && "cursor-pointer",
                  isHorizontal && "flex-col text-center",
                  !isHorizontal && "items-start"
                )}
                onClick={() => clickable && status !== "upcoming" && onStepClick?.(index)}
              >
                {/* Step Circle */}
                <div
                  className={cn(
                    "shrink-0 rounded-full flex items-center justify-center font-semibold transition-colors",
                    sizes.circle,
                    status === "completed" && "bg-blue-600 text-white",
                    status === "current" && "bg-blue-600 text-white ring-4 ring-blue-100",
                    status === "upcoming" && "bg-slate-100 text-slate-500 border-2 border-slate-200",
                    status === "error" && "bg-red-600 text-white"
                  )}
                >
                  {status === "completed" ? (
                    <Check className={cn(size === "sm" ? "h-3 w-3" : size === "md" ? "h-4 w-4" : "h-5 w-5")} />
                  ) : Icon ? (
                    <Icon className={cn(size === "sm" ? "h-3 w-3" : size === "md" ? "h-4 w-4" : "h-5 w-5")} />
                  ) : showNumbers ? (
                    index + 1
                  ) : null}
                </div>

                {/* Step Content */}
                <div className={cn(isHorizontal && "mt-2")}>
                  <p
                    className={cn(
                      "font-semibold",
                      sizes.title,
                      status === "completed" && "text-blue-600",
                      status === "current" && "text-slate-900",
                      status === "upcoming" && "text-slate-500",
                      status === "error" && "text-red-600"
                    )}
                  >
                    {step.title}
                    {step.optional && (
                      <span className="font-normal text-slate-400 ml-1">(Optional)</span>
                    )}
                  </p>
                  {step.description && (
                    <p className={cn("text-slate-500 mt-0.5", sizes.description)}>
                      {step.description}
                    </p>
                  )}
                  {step.error && (
                    <p className={cn("text-red-600 mt-0.5", sizes.description)}>
                      {step.error}
                    </p>
                  )}
                </div>
              </div>

              {/* Horizontal connector */}
              {isHorizontal && !isLast && (
                <div
                  className={cn(
                    "flex-1 mx-4",
                    sizes.connector,
                    status === "completed" ? "bg-blue-600" : "bg-slate-200"
                  )}
                />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

// Simple Text Stepper
function SimpleStepper({
  steps,
  currentStep,
  onStepClick,
  clickable = false,
  className,
}: {
  steps: Step[]
  currentStep: number
  onStepClick?: (stepIndex: number) => void
  clickable?: boolean
  className?: string
}) {
  return (
    <nav aria-label="Progress" className={className}>
      <ol className="flex items-center">
        {steps.map((step, index) => {
          const status = getStepStatus(index, currentStep, step)
          const isLast = index === steps.length - 1

          return (
            <li key={step.id} className="flex items-center">
              <button
                type="button"
                onClick={() => clickable && status !== "upcoming" && onStepClick?.(index)}
                disabled={!clickable || status === "upcoming"}
                className={cn(
                  "text-sm font-medium transition-colors",
                  status === "completed" && "text-blue-600 hover:text-blue-700",
                  status === "current" && "text-slate-900",
                  status === "upcoming" && "text-slate-400",
                  clickable && status !== "upcoming" && "cursor-pointer"
                )}
              >
                {step.title}
              </button>
              {!isLast && (
                <span className="mx-3 text-slate-400">/</span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

// Dots Stepper
function DotsStepper({
  steps,
  currentStep,
  size = "md",
  className,
}: {
  steps: Step[]
  currentStep: number
  size?: "sm" | "md" | "lg"
  className?: string
}) {
  const dotSizes = {
    sm: "h-2 w-2",
    md: "h-2.5 w-2.5",
    lg: "h-3 w-3",
  }

  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      {steps.map((step, index) => {
        const status = getStepStatus(index, currentStep, step)

        return (
          <div
            key={step.id}
            className={cn(
              "rounded-full transition-all",
              dotSizes[size],
              status === "completed" && "bg-blue-600",
              status === "current" && "bg-blue-600 scale-125",
              status === "upcoming" && "bg-slate-300",
              status === "error" && "bg-red-600"
            )}
          />
        )
      })}
    </div>
  )
}

// Progress Stepper (percentage based)
export function ProgressStepper({
  steps,
  currentStep,
  className,
}: {
  steps: Step[]
  currentStep: number
  className?: string
}) {
  const progress = (currentStep / (steps.length - 1)) * 100

  return (
    <div className={className}>
      <div className="relative">
        {/* Background */}
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, progress)}%` }}
          />
        </div>

        {/* Step dots */}
        <div className="absolute inset-0 flex justify-between">
          {steps.map((step, index) => {
            const status = getStepStatus(index, currentStep, step)

            return (
              <div
                key={step.id}
                className={cn(
                  "h-4 w-4 -mt-1 rounded-full border-2 border-white transition-colors",
                  status === "completed" && "bg-blue-600",
                  status === "current" && "bg-blue-600 ring-4 ring-blue-100",
                  status === "upcoming" && "bg-slate-300",
                  status === "error" && "bg-red-600"
                )}
              />
            )
          })}
        </div>
      </div>

      {/* Labels */}
      <div className="flex justify-between mt-3">
        {steps.map((step, index) => {
          const status = getStepStatus(index, currentStep, step)

          return (
            <div key={step.id} className="text-center" style={{ width: `${100 / steps.length}%` }}>
              <p
                className={cn(
                  "text-xs font-medium",
                  status === "completed" && "text-blue-600",
                  status === "current" && "text-slate-900",
                  status === "upcoming" && "text-slate-400"
                )}
              >
                {step.title}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Stepper Navigation Hook
export function useSteps(totalSteps: number) {
  const [currentStep, setCurrentStep] = React.useState(0)

  const nextStep = React.useCallback(() => {
    setCurrentStep((prev) => Math.min(totalSteps - 1, prev + 1))
  }, [totalSteps])

  const prevStep = React.useCallback(() => {
    setCurrentStep((prev) => Math.max(0, prev - 1))
  }, [])

  const goToStep = React.useCallback(
    (step: number) => {
      if (step >= 0 && step < totalSteps) {
        setCurrentStep(step)
      }
    },
    [totalSteps]
  )

  const reset = React.useCallback(() => {
    setCurrentStep(0)
  }, [])

  return {
    currentStep,
    totalSteps,
    nextStep,
    prevStep,
    goToStep,
    reset,
    isFirstStep: currentStep === 0,
    isLastStep: currentStep === totalSteps - 1,
    progress: (currentStep / (totalSteps - 1)) * 100,
  }
}

// Stepper with Content
export interface StepperWithContentProps {
  steps: Array<Step & { content: React.ReactNode }>
  currentStep: number
  onStepChange?: (step: number) => void
  showNavigation?: boolean
  nextLabel?: string
  prevLabel?: string
  finishLabel?: string
  onFinish?: () => void
  className?: string
}

export function StepperWithContent({
  steps,
  currentStep,
  onStepChange,
  showNavigation = true,
  nextLabel = "Next",
  prevLabel = "Previous",
  finishLabel = "Finish",
  onFinish,
  className,
}: StepperWithContentProps) {
  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === steps.length - 1

  return (
    <div className={className}>
      {/* Stepper */}
      <Stepper
        steps={steps}
        currentStep={currentStep}
        onStepClick={onStepChange}
        clickable
        className="mb-8"
      />

      {/* Content */}
      <div className="min-h-50">
        {steps[currentStep]?.content}
      </div>

      {/* Navigation */}
      {showNavigation && (
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200">
          <button
            type="button"
            onClick={() => onStepChange?.(currentStep - 1)}
            disabled={isFirstStep}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
              isFirstStep
                ? "text-slate-300 cursor-not-allowed"
                : "text-slate-700 hover:bg-slate-100"
            )}
          >
            {prevLabel}
          </button>

          <span className="text-sm text-slate-500">
            Step {currentStep + 1} of {steps.length}
          </span>

          <button
            type="button"
            onClick={() => {
              if (isLastStep) {
                onFinish?.()
              } else {
                onStepChange?.(currentStep + 1)
              }
            }}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {isLastStep ? finishLabel : nextLabel}
          </button>
        </div>
      )}
    </div>
  )
}

export default Stepper
