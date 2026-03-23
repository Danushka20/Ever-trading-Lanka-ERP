import * as React from "react"
import { useState, useMemo, useCallback } from "react"
import {
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  Download,
  RefreshCw,
  Settings2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "./button"
import { Input } from "./input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
} from "./dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select"

// Types
export interface Column<T> {
  id: string
  header: string | React.ReactNode
  accessorKey?: keyof T
  accessorFn?: (row: T) => React.ReactNode
  cell?: (row: T, index: number) => React.ReactNode
  sortable?: boolean
  filterable?: boolean
  width?: string | number
  minWidth?: string | number
  maxWidth?: string | number
  align?: "left" | "center" | "right"
  hidden?: boolean
  sticky?: "left" | "right"
  className?: string
  headerClassName?: string
}

export interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  loading?: boolean
  error?: string | null
  keyField?: keyof T
  // Pagination
  pagination?: boolean
  pageSize?: number
  pageSizeOptions?: number[]
  currentPage?: number
  totalItems?: number
  onPageChange?: (page: number) => void
  onPageSizeChange?: (size: number) => void
  // Sorting
  sortable?: boolean
  defaultSortColumn?: string
  defaultSortDirection?: "asc" | "desc"
  onSort?: (column: string, direction: "asc" | "desc") => void
  // Filtering & Search
  searchable?: boolean
  searchPlaceholder?: string
  onSearch?: (query: string) => void
  filterValue?: string
  // Selection
  selectable?: boolean
  selectedRows?: T[]
  onSelectionChange?: (selectedRows: T[]) => void
  // Row actions
  onRowClick?: (row: T, index: number) => void
  rowClassName?: (row: T, index: number) => string
  // Toolbar
  toolbar?: React.ReactNode
  showColumnToggle?: boolean
  showRefresh?: boolean
  onRefresh?: () => void
  showExport?: boolean
  onExport?: () => void
  // Empty state
  emptyState?: React.ReactNode
  emptyTitle?: string
  emptyDescription?: string
  // Styles
  className?: string
  tableClassName?: string
  headerClassName?: string
  rowHeight?: "sm" | "md" | "lg"
  striped?: boolean
  bordered?: boolean
  hoverable?: boolean
  compact?: boolean
  stickyHeader?: boolean
}

type SortDirection = "asc" | "desc" | null

interface SortState {
  column: string | null
  direction: SortDirection
}

// Helper functions
function getNestedValue<T>(obj: T, path: string): unknown {
  return path.split(".").reduce((acc: unknown, part: string) => {
    if (acc && typeof acc === "object" && part in acc) {
      return (acc as Record<string, unknown>)[part]
    }
    return undefined
  }, obj)
}

function sortData<T>(
  data: T[],
  column: string | null,
  direction: SortDirection,
  columns: Column<T>[]
): T[] {
  if (!column || !direction) return data

  const columnDef = columns.find((c) => c.id === column)
  if (!columnDef) return data

  return [...data].sort((a, b) => {
    let aValue: unknown
    let bValue: unknown

    if (columnDef.accessorFn) {
      aValue = columnDef.accessorFn(a)
      bValue = columnDef.accessorFn(b)
    } else if (columnDef.accessorKey) {
      aValue = a[columnDef.accessorKey]
      bValue = b[columnDef.accessorKey]
    } else {
      aValue = getNestedValue(a, column)
      bValue = getNestedValue(b, column)
    }

    // Handle null/undefined
    if (aValue == null && bValue == null) return 0
    if (aValue == null) return direction === "asc" ? 1 : -1
    if (bValue == null) return direction === "asc" ? -1 : 1

    // Handle numbers
    if (typeof aValue === "number" && typeof bValue === "number") {
      return direction === "asc" ? aValue - bValue : bValue - aValue
    }

    // Handle dates
    if (aValue instanceof Date && bValue instanceof Date) {
      return direction === "asc"
        ? aValue.getTime() - bValue.getTime()
        : bValue.getTime() - aValue.getTime()
    }

    // Handle strings
    const aStr = String(aValue).toLowerCase()
    const bStr = String(bValue).toLowerCase()
    const comparison = aStr.localeCompare(bStr)
    return direction === "asc" ? comparison : -comparison
  })
}

function filterData<T>(data: T[], searchQuery: string, columns: Column<T>[]): T[] {
  if (!searchQuery.trim()) return data

  const query = searchQuery.toLowerCase()
  const filterableColumns = columns.filter((c) => c.filterable !== false)

  return data.filter((row) => {
    return filterableColumns.some((col) => {
      let value: unknown

      if (col.accessorFn) {
        value = col.accessorFn(row)
      } else if (col.accessorKey) {
        value = row[col.accessorKey]
      } else {
        value = getNestedValue(row, col.id)
      }

      if (value == null) return false
      return String(value).toLowerCase().includes(query)
    })
  })
}

// Pagination Component
interface PaginationControlsProps {
  currentPage: number
  totalPages: number
  pageSize: number
  totalItems: number
  pageSizeOptions: number[]
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
  compact?: boolean
}

function PaginationControls({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  pageSizeOptions,
  onPageChange,
  onPageSizeChange,
  compact,
}: PaginationControlsProps) {
  const startItem = (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, totalItems)

  return (
    <div
      className={cn(
        "flex items-center justify-between border-t border-slate-200 bg-white px-4 py-3",
        compact && "py-2"
      )}
    >
      <div className="flex items-center gap-4 text-sm text-slate-600">
        <span>
          Showing {startItem} to {endItem} of {totalItems} results
        </span>
        <div className="flex items-center gap-2">
          <span>Rows per page:</span>
          <Select
            value={String(pageSize)}
            onValueChange={(value) => onPageSizeChange(Number(value))}
          >
            <SelectTrigger className="h-8 w-17.5">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-1 px-2">
          <span className="text-sm text-slate-600">
            Page {currentPage} of {totalPages}
          </span>
        </div>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

// Loading Skeleton
function TableSkeleton({ columns, rows = 5 }: { columns: number; rows?: number }) {
  return (
    <TableBody>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <TableRow key={rowIndex}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <TableCell key={colIndex}>
              <div className="h-4 bg-slate-200 rounded animate-pulse w-full max-w-50" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  )
}

// Empty State
function DefaultEmptyState({
  title = "No data found",
  description = "There are no items to display.",
}: {
  title?: string
  description?: string
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-4">
        <Search className="h-6 w-6 text-slate-400" />
      </div>
      <h3 className="text-sm font-semibold text-slate-900 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 text-center max-w-sm">{description}</p>
    </div>
  )
}

// Sort Icon
function SortIcon({ direction }: { direction: SortDirection }) {
  if (direction === "asc") {
    return <ChevronUp className="h-4 w-4" />
  }
  if (direction === "desc") {
    return <ChevronDown className="h-4 w-4" />
  }
  return <ChevronsUpDown className="h-4 w-4 text-slate-400" />
}

// Main DataTable Component
export function DataTable<T extends Record<string, unknown>>({
  data,
  columns: initialColumns,
  loading = false,
  error = null,
  keyField,
  // Pagination
  pagination = true,
  pageSize: initialPageSize = 10,
  pageSizeOptions = [10, 25, 50, 100],
  currentPage: controlledPage,
  totalItems: controlledTotalItems,
  onPageChange: controlledPageChange,
  onPageSizeChange: controlledPageSizeChange,
  // Sorting
  sortable = true,
  defaultSortColumn,
  defaultSortDirection = "asc",
  onSort,
  // Filtering & Search
  searchable = true,
  searchPlaceholder = "Search...",
  onSearch,
  filterValue: controlledFilterValue,
  // Selection
  selectable = false,
  selectedRows = [],
  onSelectionChange,
  // Row actions
  onRowClick,
  rowClassName,
  // Toolbar
  toolbar,
  showColumnToggle = true,
  showRefresh = false,
  onRefresh,
  showExport = false,
  onExport,
  // Empty state
  emptyState,
  emptyTitle,
  emptyDescription,
  // Styles
  className,
  tableClassName,
  headerClassName,
  rowHeight = "md",
  striped = false,
  bordered = false,
  hoverable = true,
  compact = false,
  stickyHeader = false,
}: DataTableProps<T>) {
  // Column visibility state
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>(() => {
    const visibility: Record<string, boolean> = {}
    initialColumns.forEach((col) => {
      visibility[col.id] = !col.hidden
    })
    return visibility
  })

  // Filter visible columns
  const columns = useMemo(() => {
    return initialColumns.filter((col) => columnVisibility[col.id] !== false)
  }, [initialColumns, columnVisibility])

  // Internal state for uncontrolled pagination
  const [internalPage, setInternalPage] = useState(1)
  const [internalPageSize, setInternalPageSize] = useState(initialPageSize)

  // Internal state for sorting
  const [sortState, setSortState] = useState<SortState>({
    column: defaultSortColumn || null,
    direction: defaultSortColumn ? defaultSortDirection : null,
  })

  // Internal state for search
  const [internalSearchQuery, setInternalSearchQuery] = useState("")

  // Determine if we're using controlled pagination
  const isControlledPagination = controlledPage !== undefined

  const currentPage = isControlledPagination ? controlledPage : internalPage
  const pageSize = isControlledPagination ? initialPageSize : internalPageSize

  const searchQuery =
    controlledFilterValue !== undefined ? controlledFilterValue : internalSearchQuery

  // Handle page change
  const handlePageChange = useCallback(
    (page: number) => {
      if (controlledPageChange) {
        controlledPageChange(page)
      } else {
        setInternalPage(page)
      }
    },
    [controlledPageChange]
  )

  // Handle page size change
  const handlePageSizeChange = useCallback(
    (size: number) => {
      if (controlledPageSizeChange) {
        controlledPageSizeChange(size)
      } else {
        setInternalPageSize(size)
        setInternalPage(1) // Reset to first page
      }
    },
    [controlledPageSizeChange]
  )

  // Handle sort
  const handleSort = useCallback(
    (columnId: string) => {
      const column = initialColumns.find((c) => c.id === columnId)
      if (!column?.sortable && sortable === false) return

      setSortState((prev) => {
        let newDirection: SortDirection

        if (prev.column !== columnId) {
          newDirection = "asc"
        } else if (prev.direction === "asc") {
          newDirection = "desc"
        } else if (prev.direction === "desc") {
          newDirection = null
        } else {
          newDirection = "asc"
        }

        if (onSort && newDirection) {
          onSort(columnId, newDirection)
        }

        return {
          column: newDirection ? columnId : null,
          direction: newDirection,
        }
      })

      // Reset to first page when sorting changes
      if (!isControlledPagination) {
        setInternalPage(1)
      }
    },
    [initialColumns, sortable, onSort, isControlledPagination]
  )

  // Handle search
  const handleSearch = useCallback(
    (query: string) => {
      if (onSearch) {
        onSearch(query)
      } else {
        setInternalSearchQuery(query)
      }

      // Reset to first page when search changes
      if (!isControlledPagination) {
        setInternalPage(1)
      }
    },
    [onSearch, isControlledPagination]
  )

  // Handle row selection
  const handleSelectAll = useCallback(() => {
    if (!onSelectionChange) return

    if (selectedRows.length === data.length) {
      onSelectionChange([])
    } else {
      onSelectionChange([...data])
    }
  }, [data, selectedRows, onSelectionChange])

  const handleSelectRow = useCallback(
    (row: T) => {
      if (!onSelectionChange) return

      const isSelected = selectedRows.some((selected) => {
        if (keyField) {
          return selected[keyField] === row[keyField]
        }
        return selected === row
      })

      if (isSelected) {
        onSelectionChange(
          selectedRows.filter((selected) => {
            if (keyField) {
              return selected[keyField] !== row[keyField]
            }
            return selected !== row
          })
        )
      } else {
        onSelectionChange([...selectedRows, row])
      }
    },
    [selectedRows, onSelectionChange, keyField]
  )

  const isRowSelected = useCallback(
    (row: T): boolean => {
      return selectedRows.some((selected) => {
        if (keyField) {
          return selected[keyField] === row[keyField]
        }
        return selected === row
      })
    },
    [selectedRows, keyField]
  )

  // Process data (filter, sort, paginate)
  const processedData = useMemo(() => {
    let result = [...data]

    // Apply search/filter (only for client-side filtering)
    if (!onSearch && searchQuery) {
      result = filterData(result, searchQuery, initialColumns)
    }

    // Apply sorting (only for client-side sorting)
    if (!onSort && sortState.column && sortState.direction) {
      result = sortData(result, sortState.column, sortState.direction, initialColumns)
    }

    return result
  }, [data, searchQuery, onSearch, sortState, onSort, initialColumns])

  // Calculate pagination
  const totalItems = controlledTotalItems ?? processedData.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))

  // Get current page data (only for client-side pagination)
  const currentPageData = useMemo(() => {
    if (isControlledPagination) {
      return processedData
    }

    const startIndex = (currentPage - 1) * pageSize
    return processedData.slice(startIndex, startIndex + pageSize)
  }, [processedData, currentPage, pageSize, isControlledPagination])

  // Toggle column visibility
  const toggleColumnVisibility = useCallback((columnId: string) => {
    setColumnVisibility((prev) => ({
      ...prev,
      [columnId]: !prev[columnId],
    }))
  }, [])

  // Row height classes
  const rowHeightClasses = {
    sm: "h-10",
    md: "h-12",
    lg: "h-14",
  }

  // Get cell value
  const getCellValue = (column: Column<T>, row: T, index: number): React.ReactNode => {
    if (column.cell) {
      return column.cell(row, index)
    }
    if (column.accessorFn) {
      return column.accessorFn(row)
    }
    if (column.accessorKey) {
      const value = row[column.accessorKey]
      return value != null ? String(value) : ""
    }
    return getNestedValue(row, column.id) as React.ReactNode
  }

  // Get row key
  const getRowKey = (row: T, index: number): string | number => {
    if (keyField && row[keyField] != null) {
      return String(row[keyField])
    }
    return index
  }

  return (
    <div className={cn("flex flex-col bg-white rounded-lg border border-slate-200", className)}>
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200">
        <div className="flex items-center gap-3 flex-1">
          {searchable && (
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="text"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
          )}
          {toolbar}
        </div>

        <div className="flex items-center gap-2">
          {showRefresh && (
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9"
              onClick={onRefresh}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
          
          {showExport && (
            <Button
              variant="outline"
              size="sm"
              className="h-9 gap-2"
              onClick={onExport}
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
          )}

          {showColumnToggle && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 gap-2">
                  <Settings2 className="h-4 w-4" />
                  Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {initialColumns.map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    checked={columnVisibility[column.id] !== false}
                    onCheckedChange={() => toggleColumnVisibility(column.id)}
                  >
                    {typeof column.header === "string" ? column.header : column.id}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {selectable && selectedRows.length > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-lg text-sm text-blue-700">
              <span>{selectedRows.length} selected</span>
            </div>
          )}
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-4 bg-red-50 border-b border-red-200">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Table */}
      <div className={cn("overflow-auto", stickyHeader && "max-h-150")}>
        <Table className={tableClassName}>
          <TableHeader className={cn(stickyHeader && "sticky top-0 bg-white z-10", headerClassName)}>
            <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
              {selectable && (
                <TableHead className="w-12">
                  <input
                    type="checkbox"
                    checked={data.length > 0 && selectedRows.length === data.length}
                    onChange={handleSelectAll}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                </TableHead>
              )}
              {columns.map((column) => {
                const isSortable = column.sortable !== false && sortable
                const isSorted = sortState.column === column.id

                return (
                  <TableHead
                    key={column.id}
                    className={cn(
                      "text-xs font-semibold uppercase tracking-wider text-slate-600",
                      column.headerClassName,
                      column.align === "center" && "text-center",
                      column.align === "right" && "text-right",
                      isSortable && "cursor-pointer select-none hover:bg-slate-100",
                      column.sticky === "left" && "sticky left-0 bg-white z-10",
                      column.sticky === "right" && "sticky right-0 bg-white z-10"
                    )}
                    style={{
                      width: column.width,
                      minWidth: column.minWidth,
                      maxWidth: column.maxWidth,
                    }}
                    onClick={() => isSortable && handleSort(column.id)}
                  >
                    <div
                      className={cn(
                        "flex items-center gap-2",
                        column.align === "center" && "justify-center",
                        column.align === "right" && "justify-end"
                      )}
                    >
                      <span>{column.header}</span>
                      {isSortable && (
                        <SortIcon direction={isSorted ? sortState.direction : null} />
                      )}
                    </div>
                  </TableHead>
                )
              })}
            </TableRow>
          </TableHeader>

          {loading ? (
            <TableSkeleton
              columns={columns.length + (selectable ? 1 : 0)}
              rows={pageSize}
            />
          ) : currentPageData.length === 0 ? (
            <TableBody>
              <TableRow>
                <TableCell colSpan={columns.length + (selectable ? 1 : 0)}>
                  {emptyState || (
                    <DefaultEmptyState title={emptyTitle} description={emptyDescription} />
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          ) : (
            <TableBody>
              {currentPageData.map((row, index) => {
                const rowKey = getRowKey(row, index)
                const isSelected = isRowSelected(row)

                return (
                  <TableRow
                    key={rowKey}
                    className={cn(
                      rowHeightClasses[rowHeight],
                      striped && index % 2 === 1 && "bg-slate-50/50",
                      hoverable && "hover:bg-slate-50",
                      bordered && "border-b border-slate-200",
                      onRowClick && "cursor-pointer",
                      isSelected && "bg-blue-50 hover:bg-blue-100",
                      rowClassName && rowClassName(row, index)
                    )}
                    onClick={() => onRowClick && onRowClick(row, index)}
                  >
                    {selectable && (
                      <TableCell
                        className="w-12"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectRow(row)}
                          className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                      </TableCell>
                    )}
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        className={cn(
                          compact ? "py-2" : "py-3",
                          column.className,
                          column.align === "center" && "text-center",
                          column.align === "right" && "text-right",
                          column.sticky === "left" && "sticky left-0 bg-white",
                          column.sticky === "right" && "sticky right-0 bg-white"
                        )}
                        style={{
                          width: column.width,
                          minWidth: column.minWidth,
                          maxWidth: column.maxWidth,
                        }}
                      >
                        {getCellValue(column, row, index)}
                      </TableCell>
                    ))}
                  </TableRow>
                )
              })}
            </TableBody>
          )}
        </Table>
      </div>

      {/* Pagination */}
      {pagination && !loading && totalItems > 0 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={totalItems}
          pageSizeOptions={pageSizeOptions}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          compact={compact}
        />
      )}
    </div>
  )
}

export default DataTable
