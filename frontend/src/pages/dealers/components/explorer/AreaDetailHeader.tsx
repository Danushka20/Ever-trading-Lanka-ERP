import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, Wallet, FileDown } from "lucide-react"
import type { AreaWithStats } from "@/hooks/dealers/types"
import { Button } from "@/components/ui/button"
import api from "@/lib/api"
import { useState } from "react"
import { toast } from "sonner"
import { DatePicker } from "@/components/ui/date-picker"
import axios from "axios"

interface AreaDetailHeaderProps {
  selectedArea: AreaWithStats | undefined
}

export function AreaDetailHeader({ selectedArea }: AreaDetailHeaderProps) {
  const [isDownloading, setIsDownloading] = useState(false)
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)

  const handleDownloadPdf = async () => {
    if (!selectedArea) return
    setIsDownloading(true)
    try {
      const params = new URLSearchParams()
      if (startDate) params.append('start_date', startDate.toISOString().split('T')[0])
      if (endDate) params.append('end_date', endDate.toISOString().split('T')[0])

      const query = params.toString()
      const url = query
        ? `/reports/areas/${selectedArea.id}/dealer-performance-pdf?${query}`
        : `/reports/areas/${selectedArea.id}/dealer-performance-pdf`

      const response = await api.get(url, {
        responseType: 'blob'
      })
      
      const blobUrl = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = blobUrl
      link.setAttribute('download', `Area-${selectedArea.name}-Report.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      toast.success("PDF Downloaded successfully")
    } catch (error) {
      console.error("PDF download failed:", error)

      let message = "Failed to download PDF"
      if (axios.isAxiosError(error) && error.response?.data instanceof Blob) {
        try {
          const text = await error.response.data.text()
          const parsed = JSON.parse(text) as { message?: string }
          if (parsed.message) {
            message = parsed.message
          }
        } catch {
          // Fall back to the default message when error payload is not JSON.
        }
      }

      toast.error(message)
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">From Date</label>
            <DatePicker 
              value={startDate} 
              onChange={setStartDate} 
              placeholder="Start Date"
              clearable
              className="w-[180px]"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">To Date</label>
            <DatePicker 
              value={endDate} 
              onChange={setEndDate} 
              placeholder="End Date"
              clearable
              className="w-[180px]"
            />
          </div>
        </div>

        <Button 
          variant="default" 
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold h-10 gap-2 shadow-md transition-all active:scale-95"
          onClick={handleDownloadPdf}
          disabled={isDownloading || !selectedArea}
        >
          {isDownloading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <FileDown className="w-4 h-4" />
          )}
          <span>{isDownloading ? 'Generating Report...' : 'Download Performance PDF'}</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="bg-white border-none shadow-sm overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-[100px] -mr-8 -mt-8 opacity-40 transition-transform group-hover:scale-110" />
          <CardContent className="p-5 flex items-center gap-4 relative">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
              <Wallet className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Selected Area</p>
              <h4 className="text-lg font-bold text-slate-900">{selectedArea?.name}</h4>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-none shadow-sm overflow-hidden group">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Total Area Sales</p>
              <h4 className="text-lg font-bold text-slate-900">Rs. {Number(selectedArea?.totalSales).toLocaleString()}</h4>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-none shadow-sm overflow-hidden group">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center group-hover:bg-red-100 transition-colors">
              <Wallet className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Total Outstanding</p>
              <h4 className="text-lg font-bold text-slate-900">Rs. {Number(selectedArea?.totalBalance).toLocaleString()}</h4>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
