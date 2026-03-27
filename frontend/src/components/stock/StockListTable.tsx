import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export interface StockDisplayRow {
  item_id: number
  item_code: string
  product_name: string
  category: string
  quantity: number
  reorderLevel: number
  buyPrice: number
  salesPrice: number
  totalCost: number
  totalSales: number
}

interface StockListTableProps {
  loading: boolean
  rows: StockDisplayRow[]
}

const formatCurrency = (value: number) => {
  return `Rs.${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

const getQtyValidation = (totalQty: number, reorderLevel: number) => {
  if (totalQty <= 0) {
    return <Badge className="border-none bg-rose-100 text-rose-700">Out of stock</Badge>
  }
  if (totalQty <= reorderLevel) {
    return <Badge className="border-none bg-amber-100 text-amber-700">Low stock</Badge>
  }
  return <Badge className="border-none bg-emerald-100 text-emerald-700">Healthy</Badge>
}

const getTotalCostValidation = (quantity: number, buyPrice: number) => {
  if (quantity <= 0) {
    return <Badge className="border-none bg-rose-100 text-rose-700">No quantity</Badge>
  }
  if (buyPrice <= 0) {
    return <Badge className="border-none bg-rose-100 text-rose-700">Invalid cost</Badge>
  }
  return <Badge className="border-none bg-emerald-100 text-emerald-700">Valid total</Badge>
}

const getTotalSalesValidation = (quantity: number, salesPrice: number, buyPrice: number) => {
  if (quantity <= 0) {
    return <Badge className="border-none bg-rose-100 text-rose-700">No quantity</Badge>
  }
  if (salesPrice <= 0) {
    return <Badge className="border-none bg-rose-100 text-rose-700">Invalid sales</Badge>
  }
  if (buyPrice > 0 && salesPrice < buyPrice) {
    return <Badge className="border-none bg-amber-100 text-amber-700">Loss risk</Badge>
  }
  return <Badge className="border-none bg-emerald-100 text-emerald-700">Valid total</Badge>
}

export function StockListTable({ loading, rows }: StockListTableProps) {
  if (loading) {
    return <div className="flex items-center justify-center h-50">Loading stock data...</div>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Item Code</TableHead>
          <TableHead>Product Name</TableHead>
          <TableHead>Category</TableHead>
          <TableHead className="text-right">Available Qty</TableHead>
          <TableHead>Qty Validation</TableHead>
          <TableHead className="text-right">Unit Cost</TableHead>
          <TableHead className="text-right">Qty x Cost</TableHead>
          <TableHead>Cost Validation</TableHead>
          <TableHead className="text-right">Unit Selling</TableHead>
          <TableHead className="text-right">Qty x Selling</TableHead>
          <TableHead>Sales Validation</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.length === 0 ? (
          <TableRow>
            <TableCell colSpan={11} className="h-24 text-center text-muted-foreground">
              No stock records found.
            </TableCell>
          </TableRow>
        ) : (
          rows.map((row) => (
            <TableRow key={row.item_id}>
              <TableCell className="font-mono text-xs">{row.item_code}</TableCell>
              <TableCell className="font-medium">{row.product_name}</TableCell>
              <TableCell>{row.category}</TableCell>
              <TableCell className={`text-right font-bold transition-colors ${
                row.quantity <= 0 ? "text-red-700 bg-red-50" : 
                row.quantity <= row.reorderLevel ? "text-amber-700 bg-amber-50" : 
                "text-emerald-700 bg-emerald-50"
              }`}>
                {row.quantity.toLocaleString()}
              </TableCell>
              <TableCell>{getQtyValidation(row.quantity, row.reorderLevel)}</TableCell>
              <TableCell className="font-mono text-right text-muted-foreground">
                {formatCurrency(row.buyPrice)}
              </TableCell>
              <TableCell className="font-mono text-right text-muted-foreground">
                {formatCurrency(row.totalCost)}
              </TableCell>
              <TableCell>{getTotalCostValidation(row.quantity, row.buyPrice)}</TableCell>
              <TableCell className="font-mono text-right text-muted-foreground">
                {formatCurrency(row.salesPrice)}
              </TableCell>
              <TableCell className="font-mono text-lg font-bold text-right text-blue-600">
                {formatCurrency(row.totalSales)}
              </TableCell>
              <TableCell>{getTotalSalesValidation(row.quantity, row.salesPrice, row.buyPrice)}</TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}
