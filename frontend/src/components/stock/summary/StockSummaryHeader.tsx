import { ExportButton } from "@/components/ExportButton"

interface StockSummaryHeaderProps {
  reportRows: Array<{
    product: string
    stock: number
    reorder_level: number
    cost_price: string
    selling_price: string
    cost_value: string
    sales_value: string
    profit_or_loss: string
    status: string
  }>
}

export function StockSummaryHeader({ reportRows }: StockSummaryHeaderProps) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Stock Summary</h2>
        <p className="text-muted-foreground">High-level overview of inventory performance and valuation.</p>
      </div>
      <ExportButton
        data={reportRows}
        filename={`stock_summary_report_${new Date().toISOString().split("T")[0]}`}
        title="Stock Summary Report"
        columns={[
          { header: "Product", key: "product" },
          { header: "Stock", key: "stock" },
          { header: "Reorder Level", key: "reorder_level" },
          { header: "Cost Price", key: "cost_price" },
          { header: "Selling Price", key: "selling_price" },
          { header: "Cost Value", key: "cost_value" },
          { header: "Sales Value", key: "sales_value" },
          { header: "Profit/Loss", key: "profit_or_loss" },
          { header: "Status", key: "status" },
        ]}
      />
    </div>
  )
}
