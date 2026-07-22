import React, { useState } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card } from '@/components/ui/Card'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from 'recharts'
import { BarChart3, TrendingUp, DollarSign, Truck, Users, Clock, Percent } from 'lucide-react'
import { cn, formatCurrency, formatNumber } from '@/lib/utils'

// Data sets
const monthlyRevenueData = [
  { month: 'Jan', revenue: 120000, profit: 45000, margin: 37.5 },
  { month: 'Feb', revenue: 145000, profit: 58000, margin: 40.0 },
  { month: 'Mar', revenue: 168000, profit: 71000, margin: 42.2 },
  { month: 'Apr', revenue: 155000, profit: 62000, margin: 40.0 },
  { month: 'May', revenue: 195000, profit: 88000, margin: 45.1 },
  { month: 'Jun', revenue: 230000, profit: 104000, margin: 45.2 },
  { month: 'Jul', revenue: 247000, profit: 111000, margin: 44.9 },
]

const deliveryPerformance = [
  { month: 'Jan', onTime: 92, delayed: 8 },
  { month: 'Feb', onTime: 94, delayed: 6 },
  { month: 'Mar', onTime: 91, delayed: 9 },
  { month: 'Apr', onTime: 95, delayed: 5 },
  { month: 'May', onTime: 96, delayed: 4 },
  { month: 'Jun', onTime: 93, delayed: 7 },
  { month: 'Jul', onTime: 95, delayed: 5 },
]

const customerRevenue = [
  { name: 'Apex Logistics', value: 145000, color: '#3b82f6' },
  { name: 'Summit Freight', value: 98000, color: '#7c3aed' },
  { name: 'Pacific Transport', value: 75000, color: '#10b981' },
  { name: 'Rocky Mountain Cargo', value: 62000, color: '#f59e0b' },
  { name: 'Other', value: 110000, color: '#6b7280' },
]

const driverMetrics = [
  { name: 'John Smith', miles: 14200, rating: 4.8 },
  { name: 'Jane Doe', miles: 12800, rating: 4.9 },
  { name: 'David Miller', miles: 11500, rating: 4.7 },
  { name: 'Robert Wilson', miles: 15100, rating: 4.6 },
  { name: 'Emily Taylor', miles: 10900, rating: 4.8 },
]

export default function Analytics() {
  const [period, setPeriod] = useState<'30d' | '6mo' | '1y'>('6mo')

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="Comprehensive logistics performance metrics, financial growth charts, and efficiency KPIs."
        actions={
          <div className="flex items-center gap-1 rounded-xl p-1" style={{ background: 'var(--bg-secondary)' }}>
            {[
              { id: '30d', label: 'Last 30 Days' },
              { id: '6mo', label: '6 Months' },
              { id: '1y', label: '1 Year' },
            ].map(p => (
              <button
                key={p.id}
                onClick={() => setPeriod(p.id as any)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                  period === p.id
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'text-secondary hover:text-primary'
                )}
                style={period !== p.id ? { color: 'var(--text-muted)' } : {}}
              >
                {p.label}
              </button>
            ))}
          </div>
        }
      />

      {/* Analytics Mini-Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Gross Profit Margin', value: '45.1%', icon: Percent, color: '#10b981', label: 'Avg +2.4% vs last Q' },
          { title: 'Avg Cost Per Mile', value: '$1.82', icon: DollarSign, color: '#3b82f6', label: 'Fuel surcharge adjusted' },
          { title: 'On-Time delivery', value: '94.8%', icon: Clock, color: '#f59e0b', label: 'Company benchmark 95%' },
          { title: 'Fleet Utilization', value: '82.4%', icon: Truck, color: '#7c3aed', label: '24 vehicles active' },
        ].map(card => (
          <div
            key={card.title}
            className="glass-card p-5 rounded-2xl relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${card.color}08 0%, ${card.color}02 100%)`,
            }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-muted uppercase tracking-wider">{card.title}</p>
                <p className="text-2xl font-bold mt-1.5" style={{ color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>
                  {card.value}
                </p>
                <p className="text-xs text-muted mt-2">{card.label}</p>
              </div>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${card.color}15` }}>
                <card.icon className="w-5 h-5" style={{ color: card.color }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Revenue Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-5" title="Financial Performance" description="Detailed review of gross revenue against profits and margins.">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={monthlyRevenueData} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="revenueGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} tickFormatter={v => `$${v / 1000}k`} />
              <Tooltip
                contentStyle={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: 12, fontSize: 12 }}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" />
              <Area name="Gross Revenue" type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2.5} fill="url(#revenueGrad2)" />
              <Area name="Net Profit" type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={2.5} fill="url(#profitGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Customer Breakdown */}
        <Card className="p-5" title="Revenue by Customer" description="Concentration of billing revenue across top clients.">
          <div className="flex justify-center mb-6">
            <PieChart width={160} height={160}>
              <Pie
                data={customerRevenue}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={3}
                dataKey="value"
              >
                {customerRevenue.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </div>
          <div className="space-y-2">
            {customerRevenue.map(item => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                  <span className="text-xs text-secondary truncate max-w-[140px]">{item.name}</span>
                </div>
                <span className="text-xs font-semibold text-primary">{formatCurrency(item.value)}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Delivery Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="On-Time Delivery Performance" description="Review percentage of shipments arriving on time vs delayed.">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={deliveryPerformance} margin={{ top: 10, right: 0, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: 12, fontSize: 12 }}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" />
              <Bar name="On-Time (%)" dataKey="onTime" fill="#10b981" stackId="a" radius={[4, 4, 0, 0]} />
              <Bar name="Delayed (%)" dataKey="delayed" fill="#ef4444" stackId="a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Driver Productivity */}
        <Card title="Top Performing Drivers" description="Miles driven and service rating metrics.">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ borderColor: 'var(--border-color)' }}>
                  <th className="text-left pb-2 text-xs font-semibold text-muted">Driver</th>
                  <th className="text-right pb-2 text-xs font-semibold text-muted">Miles Driven</th>
                  <th className="text-right pb-2 text-xs font-semibold text-muted">Avg Rating</th>
                </tr>
              </thead>
              <tbody>
                {driverMetrics.map(d => (
                  <tr key={d.name} className="border-b last:border-b-0" style={{ borderColor: 'var(--border-subtle)' }}>
                    <td className="py-3 text-sm font-semibold text-primary">{d.name}</td>
                    <td className="py-3 text-sm text-right text-secondary">{formatNumber(d.miles)} mi</td>
                    <td className="py-3 text-sm text-right font-bold text-emerald-400">★ {d.rating}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}
export { Analytics }
