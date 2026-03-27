import { useState, useEffect, useMemo } from "react"
import { PageHeader } from "@/components/ui/page-header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import api from "@/lib/api"
import { formatCurrency, cn } from "@/lib/utils"
import { Download, RefreshCw, ArrowUpRight, TrendingUp, Filter, BarChart2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format, startOfYear, endOfYear } from "date-fns"
import { toast } from "sonner"
import { Separator } from "@/components/ui/separator"

interface ProfitLossData {
  revenue: number;
  opening_stock: number;
  purchases: number;
  closing_stock: number;
  cost_of_sales: number;
  gross_profit: number;
  other_income: number;
  operating_expenses: number;
  net_profit: number;
  period: {
    start: string;
    end: string;
  }
}

export default function IncomeStatement() {
  const [data, setData] = useState<ProfitLossData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());

  const availableYears = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => (currentYear - i).toString());
  }, []);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const start = format(startOfYear(new Date(parseInt(selectedYear), 0, 1)), 'yyyy-MM-dd');
      const end = format(endOfYear(new Date(parseInt(selectedYear), 0, 1)), 'yyyy-MM-dd');
      
      const params = {
        start_date: start,
        end_date: end,
      };
      const response = await api.get('/reports/profit-loss', { params });
      setData(response.data);
    } catch (error) {
      toast.error("Failed to fetch profit & loss report");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [selectedYear]);

  if (loading && !data) {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <PageHeader title="Financial Summary" description="Loading report..." />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse h-32 border-none shadow-sm" />
          ))}
        </div>
      </div>
    );
  }

  const FinancialRow = ({ label, value, indent = false, isTotal = false, isNegative = false, colorClass = "" }: { 
    label: string, 
    value: number, 
    indent?: boolean, 
    isTotal?: boolean,
    isNegative?: boolean,
    colorClass?: string
  }) => (
    <div className={`flex justify-between py-3 ${indent ? 'pl-8' : ''} ${isTotal ? 'font-bold border-t border-b border-slate-100 bg-slate-50/50 -mx-4 px-4 my-2' : ''} group hover:bg-slate-50 transition-colors rounded-md`}>
      <span className="text-black dark:text-slate-400 font-medium group-hover:text-black transition-colors">{label}</span>
      <span className={cn(
        "font-semibold",
        colorClass ? colorClass : (isNegative && value > 0 ? 'text-rose-500' : (value > 0 ? 'text-emerald-600' : 'text-black'))
      )}>
        {isNegative && value > 0 ? '(' : ''}{formatCurrency(value)}{isNegative && value > 0 ? ')' : ''}
      </span>
    </div>
  );

  return (
    <div className="flex-1 space-y-6 p-8 pt-6 bg-white dark:bg-slate-950 min-h-screen">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-black dark:text-white flex items-center gap-3">
            <BarChart2 className="w-8 h-8 text-indigo-600" />
            Profit & Loss Summary
          </h1>
          <p className="text-slate-600 font-medium mt-1">Detailed performance analysis with full expense tracking</p>
        </div>
        
        <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-2 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 px-3 border-r border-slate-100 pr-4">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Fiscal Year</span>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-24 h-9 border-none shadow-none focus:ring-0 font-bold bg-slate-50">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {availableYears.map(year => (
                  <SelectItem key={year} value={year}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="h-9 w-9 border-slate-200 rounded-xl" onClick={fetchReport} disabled={loading}>
              <RefreshCw className={`w-4 h-4 text-slate-500 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            <Button variant="default" className="gap-2 bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-100 h-9 px-4 rounded-xl">
              <Download className="w-4 h-4" /> Export Report
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main P&L Card */}
        <Card className="lg:col-span-2 shadow-xl shadow-slate-200/40 border-none rounded-3xl overflow-hidden bg-white">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 px-8 py-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-xl">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold text-slate-800">Income Statement</CardTitle>
                <CardDescription className="font-medium">Total financial performance for FY {selectedYear}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-2">
              {/* Sales Section */}
              <div className="mb-4">
                <FinancialRow label="REVENUE (Sales)" value={data?.revenue || 0} colorClass="text-indigo-600 text-lg" />
              </div>

              {/* COGS Section */}
              <div className="mb-6 bg-slate-50/30 p-4 rounded-2xl border border-slate-100">
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                  <span className="w-6 h-[2px] bg-slate-200" />
                  Cost of Sales (COGS)
                </h4>
                <FinancialRow label="Opening Stock" value={data?.opening_stock || 0} indent />
                <FinancialRow label="Purchases" value={data?.purchases || 0} indent />
                <FinancialRow label="Closing Stock" value={data?.closing_stock || 0} indent isNegative />
                <FinancialRow label="TOTAL COST OF SALES" value={data?.cost_of_sales || 0} isTotal isNegative />
              </div>

              {/* Gross Profit */}
              <div className="mb-8">
                <FinancialRow label="GROSS PROFIT" value={data?.gross_profit || 0} isTotal colorClass="text-emerald-600 text-lg" />
              </div>

              {/* Other Income */}
              <div className="mb-6 bg-emerald-50/20 p-4 rounded-2xl border border-emerald-100/50">
                <h4 className="text-[11px] font-bold text-emerald-500/80 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                  <span className="w-6 h-[2px] bg-emerald-200" />
                  Additional Income
                </h4>
                <FinancialRow label="Other Income Sources" value={data?.other_income || 0} indent />
              </div>

              {/* Expenses */}
              <div className="mb-8 bg-rose-50/20 p-4 rounded-2xl border border-rose-100/50">
                <h4 className="text-[11px] font-bold text-rose-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                  <span className="w-6 h-[2px] bg-rose-200" />
                  Operating Expenses
                </h4>
                <FinancialRow label="Total Operating Expenses" value={data?.operating_expenses || 0} indent isNegative />
                <FinancialRow label="TOTAL EXPENSES" value={data?.operating_expenses || 0} isTotal isNegative />
              </div>

              <Separator className="my-8 bg-slate-100" />

              {/* Net Profit */}
              <div className={cn(
                "p-6 rounded-3xl border-2 transition-all duration-300 shadow-lg",
                data?.net_profit && data.net_profit >= 0 
                  ? 'bg-emerald-600 border-emerald-500 shadow-emerald-100 text-white' 
                  : 'bg-rose-600 border-rose-500 shadow-rose-100 text-white'
              )}>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-white/80 text-xs font-bold uppercase tracking-widest mb-1">Final Performance</p>
                    <h2 className="text-2xl font-black">NET PROFIT / (LOSS)</h2>
                  </div>
                  <div className="text-3xl font-black">
                    {formatCurrency(data?.net_profit || 0)}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Analytics Summary */}
        <div className="space-y-6">
          <Card className="border-none shadow-xl shadow-indigo-100/50 bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-3xl">
            <CardContent className="p-8">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-indigo-100 text-xs font-bold uppercase tracking-widest">Gross Profit Margin</p>
                  <h3 className="text-4xl font-black mt-2">
                    {data?.revenue ? ((data.gross_profit / data.revenue) * 100).toFixed(1) : '0.0'}%
                  </h3>
                  <div className="mt-4 flex items-center gap-2 text-indigo-100 text-sm font-medium">
                    <ArrowUpRight className="w-4 h-4" />
                    Efficiency Metric
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl shadow-slate-200/40 rounded-3xl bg-white overflow-hidden">
            <div className="h-2 bg-emerald-500" />
            <CardContent className="p-8">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Net Profit Margin</p>
                  <h3 className="text-4xl font-black mt-2 text-slate-800">
                    {data?.revenue ? ((data.net_profit / data.revenue) * 100).toFixed(1) : '0.0'}%
                  </h3>
                  <div className="mt-4 flex items-center gap-2 text-slate-500 text-sm font-medium">
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                    Overall Health
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl shadow-slate-200/40 rounded-3xl bg-white overflow-hidden">
             <div className="h-2 bg-slate-100" />
            <CardContent className="p-8">
              <h4 className="font-bold text-slate-800 mb-6 flex items-center gap-2 tracking-tight">
                <BarChart2 className="w-4 h-4 text-indigo-500" />
                Financial Summary
              </h4>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Revenue</p>
                    <p className="font-bold text-slate-700">{formatCurrency(data?.revenue || 0)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center">
                    <div className="w-5 h-5 rounded-full border-2 border-emerald-500 border-t-transparent" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Gross Profit</p>
                    <p className="font-bold text-slate-700">{formatCurrency(data?.gross_profit || 0)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-rose-50 flex items-center justify-center">
                    <div className="w-5 h-5 bg-rose-100 rounded flex items-center justify-center">
                      <div className="w-3 h-[2px] bg-rose-500" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Expenses</p>
                    <p className="font-bold text-slate-700">{formatCurrency(data?.operating_expenses || 0)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
