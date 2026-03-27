import { Plus, Tags } from "lucide-react"
import { PageHeader } from "@/components/ui/page-header"

interface ItemsHeaderProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  onAddCategory: () => void
  onAddItem: () => void
}

export function ItemsHeader({
  searchQuery,
  onSearchChange,
  onAddCategory,
  onAddItem,
}: ItemsHeaderProps) {
  return (
    <PageHeader
      title="Inventory Items"
      description="Manage your inventory items by category"
      searchValue={searchQuery}
      onSearchChange={onSearchChange}
      searchPlaceholder="Search items..."
      showSearch
      secondaryActions={[
        { label: "Add Category", icon: Tags, onClick: onAddCategory },
      ]}
      primaryAction={{
        label: "Add Item",
        icon: Plus,
        onClick: onAddItem,
      }}
    />
  )
}
