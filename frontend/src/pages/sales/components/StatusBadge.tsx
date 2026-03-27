import { Badge } from "@/components/ui/badge"

interface StatusBadgeProps {
  status: string
}

export function StatusBadge({ status }: StatusBadgeProps) {
  switch (status) {
    case 'confirmed':
      return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none">Confirmed</Badge>
    case 'hold':
      return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-none">Hold</Badge>
    case 'draft':
      return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-none">Draft</Badge>
    default:
      return <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100 border-none">{status}</Badge>
  }
}
