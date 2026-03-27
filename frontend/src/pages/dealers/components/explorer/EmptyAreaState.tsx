import { Card } from "@/components/ui/card"
import { MapPin } from "lucide-react"

export function EmptyAreaState() {
  return (
    <Card className="border-none shadow-sm bg-white/50 h-full flex flex-col items-center justify-center p-12 text-center">
      <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mb-6">
        <MapPin className="w-10 h-10 text-blue-400 animate-pulse" />
      </div>
      <h3 className="text-xl font-bold text-slate-800">Select a Sales Area</h3>
      <p className="text-slate-500 mt-2 max-w-sm">Click on an area from the left list to see all associated dealers and their performance data.</p>
    </Card>
  )
}
