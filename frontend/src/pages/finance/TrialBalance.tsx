import { PageHeader } from "@/components/ui/page-header"
import { EmptyState } from "@/components/ui/empty-state"
import { Card, CardContent } from "@/components/ui/card"

export default function TrialBalance() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <PageHeader title="Trial Balance" description="Overview of all ledger account balances" />
      <Card className="border-none shadow-sm">
        <CardContent className="p-8">
          <EmptyState variant="folder" title="Financial Summary" description="Account calculation engine coming soon" />
        </CardContent>
      </Card>
    </div>
  )
}
