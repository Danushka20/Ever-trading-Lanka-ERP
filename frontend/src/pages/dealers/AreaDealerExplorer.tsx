import { useAreaDealerData } from "@/hooks/dealers/useAreaDealerData"
import { AreaList } from "./components/explorer/AreaList"
import { AreaDetailHeader } from "./components/explorer/AreaDetailHeader"
import { DealerStatisticsTable } from "./components/explorer/DealerStatisticsTable"
import { EmptyAreaState } from "./components/explorer/EmptyAreaState"

export default function AreaDealerExplorer() {
  const { areas, dealers, selectedAreaId, setSelectedAreaId, isLoading } = useAreaDealerData()

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="w-12 h-12 border-4 rounded-full border-blue-500/20 border-t-blue-500 animate-spin" />
        <span className="font-medium text-slate-500">Loading area data...</span>
      </div>
    )
  }

  const selectedArea = areas.find(a => String(a.id) === selectedAreaId)

  return (
    <div className="flex-1 min-h-screen p-8 space-y-8 bg-slate-50/50">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Area Network</h1>
        <p className="text-slate-500">Explore your distribution network by sales area and dealer performance.</p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <AreaList 
          areas={areas} 
          selectedAreaId={selectedAreaId} 
          onSelectArea={setSelectedAreaId} 
        />

        <div className="space-y-4 lg:col-span-8">
          {!selectedAreaId ? (
            <EmptyAreaState />
          ) : (
            <div className="space-y-6">
              <AreaDetailHeader selectedArea={selectedArea} />
              <DealerStatisticsTable 
                dealers={dealers} 
                areaName={selectedArea?.name} 
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
