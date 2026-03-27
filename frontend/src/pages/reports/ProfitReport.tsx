import React, { useState } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingCart, 
  PieChart, 
  ArrowUpRight, 
  ArrowDownRight,
  Filter,
  Calendar,
  RefreshCw
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { useOfflineData } from "@/hooks/useOfflineData";
import { DateRangePicker } from "@/components/ui/date-picker";
import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/ui/loading-state";
import { cn } from "@/lib/utils";
import type { DBInvoice } from "@/lib/types";
import { InvoiceProfitLossButton } from "@/pages/sales/components/InvoiceProfitLossButton";

export default function ProfitReport() {
  const { data: invoices = [], isLoading: loadingInvoices, refetch } = useOfflineData<DBInvoice>("invoices");
  const { data: items = [] } = useOfflineData<any>("items");
  const { data: stockBatches = [] } = useOfflineData<any>("stockBatches");

  const [dateRange, setDateRange] = useState<{ from: Date | null; to: Date | null }>({
    from: null,
    to: null,
  });

  // Filter confirmed invoices within date range
  const filteredInvoices = invoices.filter(inv => {
    if (inv.status !== 'confirmed' && inv.status !== 'completed' && inv.status !== 'partial') return false;
    
    if (dateRange.from || dateRange.to) {
      const invDate = new Date(inv.invoice_date || (inv as any).created_at);
      if (dateRange.from && invDate < dateRange.from) return false;
      if (dateRange.to && invDate > dateRange.to) return false;
    }
    return true;
  });

  // Calculate Profit & Loss Data
  const reportData = React.useMemo(() => {
    let totalRevenue = 0;
    let totalCost = 0;

    filteredInvoices.forEach(invoice => {
      totalRevenue += Number(invoice.total || 0);
      
      if (invoice.items && Array.isArray(invoice.items)) {
        invoice.items.forEach((item: any) => {
          const qty = Number(item.qty || 0);
          const productId = item.product_id || item.item_id;
          const batchNo = item.batch_no;

          const batch = stockBatches.find(b => 
            (b.product_id === productId || b.item_id === productId) && 
            b.batch_no === batchNo
          );
          
          const itemData = items.find((i: any) => i.id === productId);
          const fallbackCost = Number(itemData?.buy_price || itemData?.unit_price || 0);

          totalCost += (qty * (Number(batch?.cost_price) || fallbackCost));
        });
      }
    });

    const grossProfit = totalRevenue - totalCost;
    const margin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;

    return { totalRevenue, totalCost, grossProfit, margin };
  }, [filteredInvoices, stockBatches]);

  if (loadingInvoices) return <LoadingState message="Calculating profitability..." />;

  return (
    <div className="flex-1 min-h-screen bg-slate-50/50">
      <PageHeader 
        title="Profit & Loss Analysis" 
        description="Comprehensive view of your business revenue, costs, and margins"
        icon={TrendingUp}
        size="lg"
        className="bg-white"
      />

      <div className="p-8 space-y-6">
        {/* Filters bar */}
        <div className="flex flex-wrap items-center gap-4 p-4 bg-white border shadow-sm rounded-2xl border-slate-200/60">
          <div className="flex items-center gap-2 text-slate-500 font-bold uppercase tracking-wider text-xs border-r pr-4">
            <Filter className="w-4 h-4 text-indigo-500" />
            Analysis Period
          </div>
          
          <DateRangePicker 
            startDate={dateRange.from}
            endDate={dateRange.to}
            onChange={(start, end) => setDateRange({ from: start, to: end })}
          />

          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => refetch()}
            className="h-10 w-10 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-indigo-600"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>

          <div className="ml-auto">
            <InvoiceProfitLossButton 
              invoices={filteredInvoices}
              itemsList={items}
              stockBatches={stockBatches}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard 
            title="Total Revenue" 
            value={reportData.totalRevenue} 
            icon={DollarSign} 
            color="indigo" 
            description="Total sales value"
          />
          <MetricCard 
            title="Cost of Goods" 
            value={reportData.totalCost} 
            icon={ShoppingCart} 
            color="amber" 
            description="Purchase cost of sold items"
          />
          <MetricCard 
            title="Gross Profit" 
            value={reportData.grossProfit} 
            icon={TrendingUp} 
            color={reportData.grossProfit >= 0 ? "emerald" : "rose"} 
            description="Revenue minus cost of goods"
          />
          <MetricCard 
            title="Profit Margin" 
            value={reportData.margin} 
            isPercentage 
            icon={PieChart} 
            color="blue" 
            description="Profitability percentage"
          />
        </div>

        {/* Main Analysis Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 border-none shadow-sm rounded-2xl overflow-hidden bg-white">
            <CardHeader className="border-b bg-slate-50/30">
              <CardTitle className="text-lg font-bold flex items-center gap-2 text-slate-800">
                <Calendar className="w-5 h-5 text-indigo-500" />
                Performance Summary
              </CardTitle>
              <CardDescription>Based on {filteredInvoices.length} transactions in this period</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-8">
                <ProgressBar 
                  label="Gross Profitability" 
                  value={reportData.margin} 
                  subtext="Target: > 15%"
                  color="indigo"
                />
                
                <div className="grid grid-cols-2 gap-8 pt-4">
                  <div className="p-6 rounded-2xl bg-indigo-50 border border-indigo-100/50">
                    <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-1">Average Profit / Invoice</p>
                    <p className="text-2xl font-black text-indigo-900">
                      Rs.{(filteredInvoices.length > 0 ? reportData.grossProfit / filteredInvoices.length : 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </p>
                  </div>
                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Transaction Volume</p>
                    <p className="text-2xl font-black text-slate-900">{filteredInvoices.length} <span className="text-sm font-medium text-slate-400">Invoices</span></p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white">
            <CardHeader className="border-b bg-slate-50/30">
              <CardTitle className="text-lg font-bold text-slate-800">Key Metrics</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between group">
                <span className="text-sm font-semibold text-slate-500">Sales vs Cost</span>
                <span className="text-sm font-bold text-slate-900">1 : {(reportData.totalRevenue > 0 ? reportData.totalCost / reportData.totalRevenue : 0).toFixed(2)}</span>
              </div>
              <div className="h-px bg-slate-100" />
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-500">Break-even Status</span>
                <span className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                  reportData.grossProfit > 0 ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                )}>
                  {reportData.grossProfit > 0 ? 'Profitable' : 'Loss'}
                </span>
              </div>
              <div className="h-px bg-slate-100" />
              <p className="text-xs text-slate-400 italic">
                * Profits are calculated based on item cost prices at time of receipt using FIFO principles.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon: Icon, color, isPercentage = false, description }: any) {
  const colorMap: Record<string, string> = {
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    rose: "bg-rose-50 text-rose-600 border-rose-100",
    blue: "bg-blue-50 text-blue-600 border-blue-100",
  };

  return (
    <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white transition-all hover:shadow-md hover:-translate-y-1 duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={cn("p-3 rounded-2xl border", colorMap[color])}>
            <Icon className="w-5 h-5" />
          </div>
          {isPercentage && (
            <div className={cn(
              "flex items-center gap-1 text-xs font-black px-2 py-1 rounded-lg",
              value >= 15 ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
            )}>
              {value >= 15 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {value >= 15 ? 'Good' : 'Low'}
            </div>
          )}
        </div>
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">{title}</h3>
        <p className="text-2xl font-black text-slate-900 truncate">
          {isPercentage ? `${value.toFixed(1)}%` : `Rs.${Math.abs(value).toLocaleString(undefined, { minimumFractionDigits: 0 })}`}
        </p>
        <p className="mt-2 text-xs font-semibold text-slate-400">{description}</p>
      </CardContent>
    </Card>
  );
}

function ProgressBar({ label, value, subtext }: any) {
  const safeValue = Math.min(Math.max(value, 0), 100);
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-end">
        <div>
          <span className="text-sm font-bold text-slate-800">{label}</span>
          <p className="text-xs font-medium text-slate-400">{subtext}</p>
        </div>
        <span className="text-xl font-black text-slate-900">{value.toFixed(1)}%</span>
      </div>
      <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden p-1">
        <div 
          className={cn(
            "h-full rounded-full transition-all duration-1000",
            value > 15 ? "bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.3)]" : "bg-indigo-600 shadow-[0_0_12px_rgba(79,70,229,0.3)]"
          )}
          style={{ width: `${safeValue}%` }}
        />
      </div>
    </div>
  );
}
