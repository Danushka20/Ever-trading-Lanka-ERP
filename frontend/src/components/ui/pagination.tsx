import { cn } from "@/lib/utils"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
} from "lucide-react"
import { Button } from "./button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select"

export interface PaginationProps {
  currentPage: number
  totalPages: number
  totalItems?: number
  pageSize?: number
  onPageChange: (page: number) => void
  onPageSizeChange?: (size: number) => void
  pageSizeOptions?: number[]
  showPageSize?: boolean
  showTotal?: boolean
  showFirstLast?: boolean
  showPageNumbers?: boolean
  maxVisiblePages?: number
  size?: "sm" | "md" | "lg"
  variant?: "default" | "simple" | "minimal"
  className?: string
}

const sizeClasses = {
  sm: {
    button: "h-7 w-7 text-xs",
    select: "h-7 w-16",
    text: "text-xs",
    gap: "gap-1",
  },
  md: {
    button: "h-8 w-8 text-sm",
    select: "h-8 w-20",
    text: "text-sm",
    gap: "gap-1.5",
  },
  lg: {
    button: "h-10 w-10 text-base",
    select: "h-10 w-24",
    text: "text-base",
    gap: "gap-2",
  },
}

function generatePageNumbers(
  currentPage: number,
  totalPages: number,
  maxVisible: number
): (number | "ellipsis")[] {
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const pages: (number | "ellipsis")[] = []
  const sidePages = Math.floor((maxVisible - 3) / 2)

  // Always show first page
  pages.push(1)

  // Calculate start and end of visible range
  let start = Math.max(2, currentPage - sidePages)
  let end = Math.min(totalPages - 1, currentPage + sidePages)

  // Adjust if near the beginning or end
  if (currentPage <= sidePages + 2) {
    end = Math.min(totalPages - 1, maxVisible - 2)
  }
  if (currentPage >= totalPages - sidePages - 1) {
    start = Math.max(2, totalPages - maxVisible + 3)
  }

  // Add ellipsis before if needed
  if (start > 2) {
    pages.push("ellipsis")
  }

  // Add visible pages
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  // Add ellipsis after if needed
  if (end < totalPages - 1) {
    pages.push("ellipsis")
  }

  // Always show last page
  if (totalPages > 1) {
    pages.push(totalPages)
  }

  return pages
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
  showPageSize = true,
  showTotal = true,
  showFirstLast = true,
  showPageNumbers = true,
  maxVisiblePages = 7,
  size = "md",
  variant = "default",
  className,
}: PaginationProps) {
  const sizes = sizeClasses[size]
  const pages = generatePageNumbers(currentPage, totalPages, maxVisiblePages)

  const startItem = totalItems ? (currentPage - 1) * pageSize + 1 : 0
  const endItem = totalItems ? Math.min(currentPage * pageSize, totalItems) : 0

  // Minimal variant - just prev/next with page count
  if (variant === "minimal") {
    return (
      <div className={cn("flex items-center gap-4", className)}>
        <Button
          variant="outline"
          size="icon"
          className={sizes.button}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <span className={cn("text-slate-600", sizes.text)}>
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="icon"
          className={sizes.button}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    )
  }

  // Simple variant - no page numbers
  if (variant === "simple") {
    return (
      <div
        className={cn(
          "flex items-center justify-between border-t border-slate-200 bg-white px-4 py-3",
          className
        )}
      >
        <div className={cn("text-slate-600", sizes.text)}>
          {showTotal && totalItems && (
            <span>
              Showing {startItem} to {endItem} of {totalItems} results
            </span>
          )}
        </div>
        <div className={cn("flex items-center", sizes.gap)}>
          <Button
            variant="outline"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="gap-2"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    )
  }

  // Default variant - full pagination
  return (
    <div
      className={cn(
        "flex items-center justify-between border-t border-slate-200 bg-white px-4 py-3 flex-wrap gap-4",
        className
      )}
    >
      {/* Left side - Total info and page size */}
      <div className="flex items-center gap-4">
        {showTotal && totalItems && (
          <span className={cn("text-slate-600 whitespace-nowrap", sizes.text)}>
            Showing {startItem} to {endItem} of {totalItems}
          </span>
        )}
        {showPageSize && onPageSizeChange && (
          <div className="flex items-center gap-2">
            <span className={cn("text-slate-600 whitespace-nowrap", sizes.text)}>
              per page
            </span>
            <Select
              value={String(pageSize)}
              onValueChange={(value) => onPageSizeChange(Number(value))}
            >
              <SelectTrigger className={sizes.select}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((option) => (
                  <SelectItem key={option} value={String(option)}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Right side - Page controls */}
      <div className={cn("flex items-center", sizes.gap)}>
        {/* First page button */}
        {showFirstLast && (
          <Button
            variant="outline"
            size="icon"
            className={sizes.button}
            onClick={() => onPageChange(1)}
            disabled={currentPage <= 1}
            title="First page"
          >
            <ChevronsLeft className="w-4 h-4" />
          </Button>
        )}

        {/* Previous button */}
        <Button
          variant="outline"
          size="icon"
          className={sizes.button}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          title="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        {/* Page numbers */}
        {showPageNumbers && (
          <div className={cn("flex items-center", sizes.gap)}>
            {pages.map((page, index) => {
              if (page === "ellipsis") {
                return (
                  <span
                    key={`ellipsis-${index}`}
                    className={cn(
                      "flex items-center justify-center text-slate-400",
                      sizes.button
                    )}
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </span>
                )
              }

              const isActive = page === currentPage

              return (
                <Button
                  key={page}
                  variant={isActive ? "default" : "outline"}
                  size="icon"
                  className={cn(
                    sizes.button,
                    isActive && "bg-blue-600 hover:bg-blue-700 border-blue-600"
                  )}
                  onClick={() => onPageChange(page)}
                >
                  {page}
                </Button>
              )
            })}
          </div>
        )}

        {/* Next button */}
        <Button
          variant="outline"
          size="icon"
          className={sizes.button}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          title="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>

        {/* Last page button */}
        {showFirstLast && (
          <Button
            variant="outline"
            size="icon"
            className={sizes.button}
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage >= totalPages}
            title="Last page"
          >
            <ChevronsRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  )
}

// Standalone page size selector
export function PageSizeSelector({
  value,
  onChange,
  options = [10, 25, 50, 100],
  label = "Rows per page:",
  className,
}: {
  value: number
  onChange: (size: number) => void
  options?: number[]
  label?: string
  className?: string
}) {
  return (
    <div className={cn("flex items-center gap-2 text-sm", className)}>
      <span className="text-slate-600">{label}</span>
      <Select value={String(value)} onValueChange={(v) => onChange(Number(v))}>
        <SelectTrigger className="w-20 h-8">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={String(option)}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

// Page info display
export function PageInfo({
  currentPage,
  totalPages: _totalPages,
  totalItems,
  pageSize,
  className,
}: {
  currentPage: number
  totalPages: number
  totalItems: number
  pageSize: number
  className?: string
}) {
  const startItem = (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, totalItems)

  return (
    <div className={cn("text-sm text-slate-600", className)}>
      Showing <span className="font-medium text-slate-900">{startItem}</span> to{" "}
      <span className="font-medium text-slate-900">{endItem}</span> of{" "}
      <span className="font-medium text-slate-900">{totalItems}</span> results
    </div>
  )
}

export default Pagination
