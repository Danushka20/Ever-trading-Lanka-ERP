import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"
import type { DealerWithStats } from "@/hooks/dealers/types"

import { DealerPerformancePdfButton } from "./DealerPerformancePdfButton"

interface DealerStatisticsTableProps {
  dealers: DealerWithStats[]
  areaName?: string
}

export function DealerStatisticsTable({ dealers, areaName }: DealerStatisticsTableProps) {
  return (
    <Card className="border-none shadow-sm overflow-hidden bg-white">
      <CardHeader className="border-b border-slate-50 bg-slate-50/30 flex flex-row items-center justify-between py-4">
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <Users className="w-4 h-4 text-blue-500" /> Dealers in {areaName}
        </CardTitle>
        <DealerPerformancePdfButton dealers={dealers} areaName={areaName} />
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead className="pl-6 font-bold text-[10px] uppercase tracking-wider text-slate-400">Dealer Info</TableHead>
              <TableHead className="font-bold text-[10px] uppercase tracking-wider text-slate-400">Total Sales</TableHead>
              <TableHead className="font-bold text-[10px] uppercase tracking-wider text-slate-400">Paid</TableHead>
              <TableHead className="font-bold text-[10px] uppercase tracking-wider text-slate-400">Balance</TableHead>
              <TableHead className="pr-6 text-right font-bold text-[10px] uppercase tracking-wider text-slate-400">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dealers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-slate-400 italic">
                  No dealers found for this area.
                </TableCell>
              </TableRow>
            ) : (
              dealers.map((dealer) => (
                <TableRow key={dealer.id} className="hover:bg-slate-50/50 transition-colors">
                  <TableCell className="pl-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900">{dealer.name}</span>
                      <span className="text-[10px] text-slate-400">{dealer.main_town} • {dealer.phone}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold text-slate-700 text-sm">Rs. {Number(dealer.totalSales).toLocaleString()}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold text-emerald-600 text-sm">Rs. {Number(dealer.totalPaid).toLocaleString()}</span>
                  </TableCell>
                  <TableCell>
                    <span className={cn(
                      "font-bold text-sm",
                      dealer.balance > 0 ? "text-red-500" : "text-emerald-500"
                    )}>
                      Rs. {Number(dealer.balance).toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell className="pr-6 text-right">
                    <Badge className={cn(
                      "text-[10px] font-bold px-2 py-0.5 rounded-full border-none",
                      dealer.is_active ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                    )}>
                      {dealer.is_active ? "ACTIVE" : "INACTIVE"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
