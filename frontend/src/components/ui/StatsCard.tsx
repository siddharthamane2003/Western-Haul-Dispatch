import React from 'react'
import { AreaChart, Area, ResponsiveContainer } from 'recharts'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn, formatNumber } from '@/lib/utils'

interface StatsCardProps {
  title: string
  value: string | number
  change?: number
  changeLabel?: string
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>
  color?: string
  trend?: number[]
  className?: string
}

export function StatsCard({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  color = '#3b82f6', // Brand blue by default
  trend,
  className,
}: StatsCardProps) {
  const isPositive = change != null ? change >= 0 : true
  const chartData = trend ? trend.map((v, i) => ({ id: i, value: v })) : []

  return (
    <div
      className={cn('glass-card p-5 rounded-2xl relative overflow-hidden flex flex-col justify-between', className)}
      style={{
        background: `linear-gradient(135deg, ${color}08 0%, ${color}02 100%)`,
      }}
    >
      <div className="flex items-start justify-between mb-3 relative z-10">
        <div>
          <p className="text-xs font-semibold text-muted uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-bold mt-1" style={{ color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>
            {typeof value === 'number' ? formatNumber(value) : value}
          </p>
        </div>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `${color}15` }}
        >
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
      </div>

      <div className="flex items-end justify-between mt-auto relative z-10 gap-4">
        {change != null ? (
          <div>
            <div
              className={cn(
                'inline-flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-full leading-none',
                isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
              )}
            >
              {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {Math.abs(change)}%
            </div>
            {changeLabel && (
              <p className="text-[10px] text-muted mt-1 leading-none">{changeLabel}</p>
            )}
          </div>
        ) : (
          <div className="h-6" />
        )}

        {trend && trend.length > 0 && (
          <div className="w-24 h-10 opacity-80 flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
                <defs>
                  <linearGradient id={`trendGrad-${title.replace(/\s+/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={color} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={color}
                  strokeWidth={1.5}
                  fill={`url(#trendGrad-${title.replace(/\s+/g, '')})`}
                  dot={false}
                  activeDot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Decorative subtle gradient background circle */}
      <div
        className="absolute -right-10 -bottom-10 w-28 h-28 rounded-full blur-3xl pointer-events-none opacity-20"
        style={{ background: color }}
      />
    </div>
  )
}
export default StatsCard
