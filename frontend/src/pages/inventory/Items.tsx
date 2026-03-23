import { useState, useMemo } from "react"
import { Plus, Tags, Package } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PageHeader } from "@/components/ui/page-header"
import { LoadingState } from "@/components/ui/loading-state"
import { EmptyState } from "@/components/ui/empty-state"
import { RowActionMenu } from "@/components/ui/action-menu"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { ItemDialog } from "./ItemDialog"
import { CategoryDialog } from "./CategoryDialog"
import { toast } from "sonner"
import { useOfflineData } from "@/hooks/useOfflineData"
import type { DBItem, DBCategory } from "@/lib/types"

export default function Items() {
  const { 
    data: items, 
    isLoading: itemsLoading, 
    delete: deleteItem,
    refetch: refetchItems
  } = useOfflineData<DBItem>("items")

  const {
    data: categories,
    isLoading: categoriesLoading,
    refetch: refetchCategories
  } = useOfflineData<DBCategory>("categories")

  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  
  const [itemDialogOpen, setItemDialogOpen] = useState(false)
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<DBItem | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<DBCategory | null>(null)
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)

  const handleEdit = (item: DBItem) => {
    setSelectedItem(item)
    setItemDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!itemToDelete) return
    setDeleting(true)
    try {
      await deleteItem(itemToDelete)
      toast.success('Item deleted successfully')
    } catch (e: any) {
      toast.error(e.message || 'Failed to delete item')
    } finally {
      setDeleting(false)
      setDeleteDialogOpen(false)
      setItemToDelete(null)
    }
  }

  const openAddItem = () => {
    setSelectedItem(null)
    setItemDialogOpen(true)
  }

  const openAddCategory = () => {
    setSelectedCategory(null)
    setCategoryDialogOpen(true)
  }

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sku?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.barcode?.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesCategory = categoryFilter === "all" || 
        item.category_id?.toString() === categoryFilter
      
      return matchesSearch && matchesCategory
    })
  }, [items, searchQuery, categoryFilter])

  if (itemsLoading || categoriesLoading) return <LoadingState />

  return (
    <div className="flex-1 min-h-screen p-8 pt-6 space-y-6 bg-slate-50/50">
      <PageHeader 
        title="Inventory Items" 
        description="Manage your inventory items by category"
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search items..."
        showSearch
        secondaryActions={[
          { label: "Add Category", icon: Tags, onClick: openAddCategory }
        ]}
        primaryAction={{
          label: "Add Item",
          icon: Plus,
          onClick: openAddItem
        }}
      />

      {/* Category Filter */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-slate-600">Filter by Category:</span>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-48 bg-white"><SelectValue placeholder="All Categories" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(cat => (
              <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          {filteredItems.length === 0 ? (
            <EmptyState 
              variant={searchQuery || categoryFilter !== "all" ? "search" : "default"}
              title="No items found"
              description={searchQuery || categoryFilter !== "all" ? "Try adjusting your filters" : "Add your first inventory item"}
              action={{ label: "Add Item", onClick: openAddItem }}
            />
          ) : (
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="font-semibold">Item</TableHead>
                  <TableHead className="font-semibold">Item Category</TableHead>
                  <TableHead className="font-semibold">Item Code</TableHead>
                  <TableHead className="font-semibold text-right">Reorder Level</TableHead>
                  <TableHead className="font-semibold text-right">Unit Price</TableHead>
                  <TableHead className="font-semibold text-right">Selling Price</TableHead>
                  <TableHead className="w-14"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item.id} className="hover:bg-slate-50/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-50">
                          <Package className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{item.name}</p>
                          {item.unit && <p className="text-xs text-slate-500">{item.unit.name}</p>}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {item.category ? (
                        <Badge variant="secondary" className="bg-slate-100">{item.category.name}</Badge>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </TableCell>
                    <TableCell className="font-mono text-sm text-slate-600">{item.sku || '—'}</TableCell>
                    <TableCell className="font-semibold text-right text-slate-700">
                      {Number(item.reorder_level || 0)}
                    </TableCell>
                    <TableCell className="font-semibold text-right text-slate-700">
                      Rs.{Number(item.buy_price || 0).toFixed(2)}
                    </TableCell>
                    <TableCell className="font-semibold text-right text-slate-700">
                      Rs.{Number(item.unit_price || 0).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <RowActionMenu
                        actions={[
                          { label: "Edit", onClick: () => handleEdit(item) },
                          { label: "Delete", onClick: () => { setItemToDelete(item.id); setDeleteDialogOpen(true) }, variant: "danger" }
                        ]}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <ItemDialog
        open={itemDialogOpen}
        onOpenChange={setItemDialogOpen}
        item={selectedItem}
        onSuccess={() => { refetchItems(); refetchCategories(); }}
      />

      <CategoryDialog
        open={categoryDialogOpen}
        onOpenChange={setCategoryDialogOpen}
        category={selectedCategory}
        onSuccess={refetchCategories}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Item"
        description="Are you sure you want to delete this item? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        variant="danger"
        loading={deleting}
      />
    </div>
  )
}

