import { useState } from "react"
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

const weekData = [
  { name: 'Mon', sales: 42000, profit: 18000 },
  { name: 'Tue', sales: 31000, profit: 14000 },
  { name: 'Wed', sales: 58000, profit: 25000 },
  { name: 'Thu', sales: 47000, profit: 20000 },
  { name: 'Fri', sales: 63000, profit: 29000 },
  { name: 'Sat', sales: 55000, profit: 22000 },
  { name: 'Sun', sales: 38000, profit: 16000 },
]

const monthData = [
  { name: 'Week 1', sales: 210000, profit: 88000 },
  { name: 'Week 2', sales: 185000, profit: 72000 },
  { name: 'Week 3', sales: 240000, profit: 105000 },
  { name: 'Week 4', sales: 290000, profit: 130000 },
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-slate-100 rounded-xl shadow-xl p-3 text-xs">
        <p className="font-black text-slate-700 mb-2">{label}</p>
        {payload.map((p: any) => (
          <div key={p.name} className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: p.color }} />
            <span className="text-slate-500 capitalize">{p.name}:</span>
            <span className="font-bold text-slate-800">Rs.{p.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export function RevenueChart() {
  const [period, setPeriod] = useState<'week' | 'month'>('week')
  const data = period === 'week' ? weekData : monthData

  return (
    <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-base font-black text-slate-900">Revenue Overview</h3>
          <p className="text-xs text-slate-500 mt-0.5">Sales vs Profit comparison</p>
        </div>
        <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
          {(['week', 'month'] as const).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all capitalize ${
                period === p ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {p === 'week' ? 'This Week' : 'This Month'}
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-5 mb-5">
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-blue-500" />
          <span className="text-xs font-medium text-slate-500">Sales</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
          <span className="text-xs font-medium text-slate-500">Profit</span>
        </div>
      </div>
      <div className="h-65 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="gSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="gProfit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="sales" stroke="#3b82f6" fill="url(#gSales)" strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }} />
            <Area type="monotone" dataKey="profit" stroke="#10b981" fill="url(#gProfit)" strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
