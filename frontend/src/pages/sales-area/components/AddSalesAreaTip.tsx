import { Sparkles } from "lucide-react"

export function AddSalesAreaTip() {
  return (
    <div className="flex gap-3 p-4 italic border border-blue-100 bg-blue-50/50 rounded-2xl">
      <Sparkles className="w-5 h-5 text-blue-500 shrink-0" />
      <p className="text-sm text-blue-800">
        <strong>Pro Tip:</strong> Territories with defined cities are easier for your sales team to locate and
        manage in the mobile app.
      </p>
    </div>
  )
}
