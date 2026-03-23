import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FilterPanelProps {
  title?: string
  onSearch?: (value: string) => void
  onFilter?: () => void
}

export function FilterPanel({ title = "Filters", onSearch }: FilterPanelProps) {
  return (
    <Card className="border-none shadow-sm h-fit">
      <CardHeader className="pb-4">
        <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-500">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Quick lookup..." 
            className="pl-8 bg-slate-50 border-none h-9 text-xs" 
            onChange={(e) => onSearch?.(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label className="text-[10px] font-bold text-slate-400 uppercase">Search by Category</Label>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" className="h-8 text-[11px] font-bold justify-start px-2 bg-slate-50/50 border-none">
                All Items
            </Button>
            <Button variant="ghost" className="h-8 text-[11px] font-bold justify-start px-2 hover:bg-slate-50">
                Medical
            </Button>
          </div>
        </div>

        <div className="pt-2">
            <Button className="w-full gap-2 h-9 text-xs font-bold bg-slate-900">
                <Filter className="h-3 w-3" />
                Apply Filters
            </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function Label({ children, className }: { children: React.ReactNode, className?: string }) {
    return <label className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)}>{children}</label>
}

import { cn } from "@/lib/utils"
