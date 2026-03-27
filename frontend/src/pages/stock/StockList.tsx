import { useState, useMemo } from "react"
import { useOfflineData } from "@/hooks/useOfflineData"
import type { DBStockBatch, DBItem } from "@/lib/types"
import { type StockExportRow } from "@/components/stock/StockListToolbar"
import { StockListPageHeader } from "@/components/stock/list/StockListPageHeader"
import { StockInventoryCard } from "@/components/stock/list/StockInventoryCard"

export default function StockList() {
  const { data: stock, isLoading: loading } = useOfflineData<DBStockBatch>("stockBatches")
  const { data: items } = useOfflineData<DBItem>("items")
  const [searchQuery, setSearchQuery] = useState("")
  const [itemCodeFilter, setItemCodeFilter] = useState("all")

  const formatCurrency = (value: number) => {
    return `Rs.${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const aggregatedStock = useMemo(() => {
    // 1. Group all available batches by item_id
    const groupedBatches: Record<number, any[]> = {};
    stock.forEach(s => {
      const itemId = Number(s.item_id);
      if (!groupedBatches[itemId]) groupedBatches[itemId] = [];
      groupedBatches[itemId].push(s);
    });

    // 2. Map every item to its summarized stock data
    return items.map(item => {
      const itemBatches = groupedBatches[item.id] || [];
      const total_quantity = itemBatches.reduce((sum, b) => sum + Number(b.remaining_quantity || b.quantity || 0), 0);
      
      return {
        item_id: item.id,
        item: item,
        total_quantity: total_quantity,
        item_code: item.sku || 'N/A',
        category: (item as any).category?.name || 'Uncategorized'
      };
    });
  }, [stock, items])

  const filteredStock = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase()

    return aggregatedStock.filter((s) => {
      const itemName = s.item?.name?.toLowerCase() || ""
      const itemCode = s.item_code?.toLowerCase() || ""
      const category = s.category?.toLowerCase() || ""
      const matchesItemCode = itemCodeFilter === "all" || s.item_code === itemCodeFilter

      if (!matchesItemCode) {
        return false
      }

      if (!normalizedQuery) {
        return true
      }

      return (
        itemName.includes(normalizedQuery) ||
        itemCode.includes(normalizedQuery) ||
        category.includes(normalizedQuery)
      )
    })
  }, [aggregatedStock, searchQuery, itemCodeFilter])

  const itemCodeOptions = useMemo(() => {
    return Array.from(
      new Set(aggregatedStock.map((s) => s.item_code).filter((code) => Boolean(code && code.trim())))
    ).sort((a, b) => a.localeCompare(b))
  }, [aggregatedStock])

  const displayRows = useMemo(() => {
    return filteredStock.map((s) => {
      const buyPrice = Number(s.item?.buy_price || 0)
      const salesPrice = Number(s.item?.unit_price || 0)
      const quantity = Number(s.total_quantity || 0)
      const reorderLevel = Number(s.item?.reorder_level || 0)

      return {
        item_id: s.item_id,
        item_code: s.item_code,
        product_name: s.item?.name || "Unknown",
        category: s.category,
        quantity,
        reorderLevel,
        buyPrice,
        salesPrice,
        totalCost: quantity * buyPrice,
        totalSales: quantity * salesPrice,
      }
    })
  }, [filteredStock])

  const exportRows = useMemo<StockExportRow[]>(() => {
    return displayRows.map((row) => {
      const totalCost = row.totalCost
      const totalSales = row.totalSales

      const qtyValidation =
        row.quantity <= 0 ? "Out of stock" : row.quantity <= row.reorderLevel ? "Low stock" : "Healthy"

      const costValidation =
        row.quantity <= 0 ? "No quantity" : row.buyPrice <= 0 ? "Invalid cost" : "Valid total"

      const salesValidation =
        row.quantity <= 0
          ? "No quantity"
          : row.salesPrice <= 0
            ? "Invalid sales"
            : row.buyPrice > 0 && row.salesPrice < row.buyPrice
              ? "Loss risk"
              : "Valid total"

      return {
        item_code: row.item_code,
        product_name: row.product_name,
        category: row.category,
        quantity: row.quantity,
        qty_validation: qtyValidation,
        unit_cost: formatCurrency(row.buyPrice),
        total_cost: formatCurrency(totalCost),
        cost_validation: costValidation,
        unit_selling: formatCurrency(row.salesPrice),
        total_selling: formatCurrency(totalSales),
        sales_validation: salesValidation,
      }
    })
  }, [displayRows])

  return (
    <div className="flex-1 p-8 pt-6 space-y-4">
      <StockListPageHeader />
      <StockInventoryCard
        loading={loading}
        rows={displayRows}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        itemCodeFilter={itemCodeFilter}
        onItemCodeFilterChange={setItemCodeFilter}
        itemCodeOptions={itemCodeOptions}
        exportRows={exportRows}
      />
    </div>
  )
}
