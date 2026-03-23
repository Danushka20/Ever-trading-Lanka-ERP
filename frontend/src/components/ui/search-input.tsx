import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export function SearchInput({ className, ...props }: SearchInputProps) {
  return (
    <div className={cn("relative w-full max-w-sm", className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-blue-500" />
      <Input
        {...props}
        className={cn(
          "pl-10 h-10 bg-white border-slate-200 focus-visible:ring-blue-500 shadow-sm transition-shadow hover:shadow-md",
          className
        )}
      />
    </div>
  )
}
