import React from 'react'
import { cn, statusColors, getStatusLabel } from '@/lib/utils'

interface StatusBadgeProps {
  status: string
  type?: 'order' | 'dispatch' | 'driver' | 'vehicle'
  className?: string
}

export function StatusBadge({ status, type, className }: StatusBadgeProps) {
  const normStatus = status.toLowerCase()
  const color = statusColors[normStatus] || 'gray'
  const label = getStatusLabel(status)

  const colorStyles: Record<string, { bg: string; text: string; dot: string }> = {
    blue: {
      bg: 'bg-blue-500/10 dark:bg-blue-500/15',
      text: 'text-blue-600 dark:text-blue-400',
      dot: 'bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.6)]',
    },
    green: {
      bg: 'bg-emerald-500/10 dark:bg-emerald-500/15',
      text: 'text-emerald-600 dark:text-emerald-400',
      dot: 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]',
    },
    yellow: {
      bg: 'bg-amber-500/10 dark:bg-amber-500/15',
      text: 'text-amber-600 dark:text-amber-400',
      dot: 'bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.6)]',
    },
    red: {
      bg: 'bg-red-500/10 dark:bg-red-500/15',
      text: 'text-red-600 dark:text-red-400',
      dot: 'bg-red-400 shadow-[0_0_6px_rgba(248,113,113,0.6)]',
    },
    purple: {
      bg: 'bg-purple-500/10 dark:bg-purple-500/15',
      text: 'text-purple-600 dark:text-purple-400',
      dot: 'bg-purple-500 shadow-[0_0_6px_rgba(168,85,247,0.6)]',
    },
    orange: {
      bg: 'bg-orange-500/10 dark:bg-orange-500/15',
      text: 'text-orange-600 dark:text-orange-400',
      dot: 'bg-orange-500 shadow-[0_0_6px_rgba(249,115,22,0.6)]',
    },
    gray: {
      bg: 'bg-slate-500/10 dark:bg-slate-500/15',
      text: 'text-slate-600 dark:text-slate-400',
      dot: 'bg-slate-400',
    },
  }

  const styles = colorStyles[color] || colorStyles.gray

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold select-none leading-none h-6 border border-transparent',
        styles.bg,
        styles.text,
        className
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full', styles.dot)} />
      {label}
    </span>
  )
}
export default StatusBadge
