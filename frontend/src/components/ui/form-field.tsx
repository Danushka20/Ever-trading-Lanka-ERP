import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface FormFieldProps {
  label?: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
  id?: string;
}

export function FormField({ label, error, required, className, children, id }: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label htmlFor={id} className={cn(error && "text-red-500", "font-medium")}>
          {label} {required && <span className="text-red-500 font-bold">*</span>}
        </Label>
      )}
      {children}
      {error && (
        <p className="text-xs font-medium text-red-500 animate-in fade-in slide-in-from-top-1 duration-200">
          {error}
        </p>
      )}
    </div>
  )
}
