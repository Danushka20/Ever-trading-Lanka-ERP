import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { DBCategory } from "@/lib/types"

interface ItemsCategoryFilterProps {
  categoryFilter: string
  onCategoryFilterChange: (value: string) => void
  categories: DBCategory[]
}

export function ItemsCategoryFilter({
  categoryFilter,
  onCategoryFilterChange,
  categories,
}: ItemsCategoryFilterProps) {
  return (
    <div className="flex items-center gap-4">
      <span className="text-sm font-medium text-slate-600">Filter by Category:</span>
      <Select value={categoryFilter} onValueChange={onCategoryFilterChange}>
        <SelectTrigger className="w-48 bg-white">
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id.toString()}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
