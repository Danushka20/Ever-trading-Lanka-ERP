import { ChevronLeft, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AddSalesAreaHeaderProps {
  isEdit: boolean
  onBack: () => void
}

export function AddSalesAreaHeader({ isEdit, onBack }: AddSalesAreaHeaderProps) {
  return (
    <>
      <Button
        variant="ghost"
        onClick={onBack}
        className="transition-colors hover:bg-white text-slate-500 hover:text-blue-600 group"
      >
        <ChevronLeft className="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-1" />
        Back to Territories
      </Button>

      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center bg-blue-600 shadow-lg h-14 w-14 rounded-2xl shadow-blue-200">
          <Sparkles className="text-white h-7 w-7" />
        </div>
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
            {isEdit ? "Refine Territory" : "New Sales Territory"}
          </h2>
          <p className="font-medium text-slate-500">
            {isEdit
              ? "Update and optimize your regional sales boundaries."
              : "Expand your reach by defining a new sales district."}
          </p>
        </div>
      </div>
    </>
  )
}
