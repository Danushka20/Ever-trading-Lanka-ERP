import { LoadingState } from "@/components/ui/loading-state"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { ItemDialog } from "./ItemDialog"
import { CategoryDialog } from "./CategoryDialog"
import { ItemsHeader } from "@/components/inventory/items/ItemsHeader"
import { ItemsCategoryFilter } from "@/components/inventory/items/ItemsCategoryFilter"
import { ItemsTableCard } from "@/components/inventory/items/ItemsTableCard"
import { useItemsPageData } from "@/hooks/inventory/useItemsPageData"

export default function Items() {
  const {
    categories,
    isLoading,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    itemDialogOpen,
    setItemDialogOpen,
    categoryDialogOpen,
    setCategoryDialogOpen,
    selectedItem,
    selectedCategory,
    deleteDialogOpen,
    setDeleteDialogOpen,
    deleting,
    openAddItem,
    openAddCategory,
    handleEdit,
    handleDelete,
    requestDelete,
    filteredItems,
    refetchItems,
    refetchCategories,
  } = useItemsPageData()

  if (isLoading) return <LoadingState />

  return (
    <div className="flex-1 min-h-screen p-8 pt-6 space-y-6 bg-slate-50/50">
      <ItemsHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAddCategory={openAddCategory}
        onAddItem={openAddItem}
      />

      <ItemsCategoryFilter
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        categories={categories}
      />

      <ItemsTableCard
        items={filteredItems}
        searchQuery={searchQuery}
        categoryFilter={categoryFilter}
        onAddItem={openAddItem}
        onEdit={handleEdit}
        onDeleteRequest={requestDelete}
      />

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

