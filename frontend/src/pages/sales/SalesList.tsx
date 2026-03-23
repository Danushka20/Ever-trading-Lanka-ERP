import { PageHeader } from "@/components/ui/page-header"
import { EmptyState } from "@/components/ui/empty-state"
import { Card, CardContent } from "@/components/ui/card"

export default function SalesList() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <PageHeader title="Sales List" description="View and manage all previous sales transactions" />
      <Card className="border-none shadow-sm">
        <CardContent className="p-8">
          <EmptyState variant="folder" title="Transaction History" description="Sales list and filtering coming soon" />
        </CardContent>
      </Card>
    </div>
  )
}
