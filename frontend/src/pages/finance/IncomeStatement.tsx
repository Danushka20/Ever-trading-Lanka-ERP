import { PageHeader } from "@/components/ui/page-header"
import { EmptyState } from "@/components/ui/empty-state"
import { Card, CardContent } from "@/components/ui/card"

export default function IncomeStatement() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <PageHeader title="Income Statement" description="Analysis of revenue and expenses over time" />
      <Card className="border-none shadow-sm">
        <CardContent className="p-8">
          <EmptyState variant="folder" title="Profit & Loss" description="P&L statement generation coming soon" />
        </CardContent>
      </Card>
    </div>
  )
}
