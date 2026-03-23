import { PageHeader } from "@/components/ui/page-header"
import { EmptyState } from "@/components/ui/empty-state"
import { Card, CardContent } from "@/components/ui/card"

export default function StockReport() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <PageHeader title="Stock Report" description="Detailed stock movement and levels report" />
      <Card className="border-none shadow-sm">
        <CardContent className="p-8">
          <EmptyState variant="folder" title="Inventory Analysis" description="Stock reporting tools coming soon" />
        </CardContent>
      </Card>
    </div>
  )
}
