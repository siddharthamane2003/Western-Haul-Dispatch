import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow, parseISO, isValid } from 'date-fns'

// Tailwind class merging
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Currency formatting
export function formatCurrency(value: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatCurrencyFull(value: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

// Number formatting
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value)
}

export function formatCompact(value: number): string {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)
}

// Date formatting
export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return '—'
  try {
    const d = typeof date === 'string' ? parseISO(date) : date
    if (!isValid(d)) return '—'
    return format(d, 'MMM d, yyyy')
  } catch {
    return '—'
  }
}

export function formatDateTime(date: string | Date | null | undefined): string {
  if (!date) return '—'
  try {
    const d = typeof date === 'string' ? parseISO(date) : date
    if (!isValid(d)) return '—'
    return format(d, 'MMM d, yyyy h:mm a')
  } catch {
    return '—'
  }
}

export function formatTimeAgo(date: string | Date | null | undefined): string {
  if (!date) return '—'
  try {
    const d = typeof date === 'string' ? parseISO(date) : date
    if (!isValid(d)) return '—'
    return formatDistanceToNow(d, { addSuffix: true })
  } catch {
    return '—'
  }
}

export function formatShortDate(date: string | Date | null | undefined): string {
  if (!date) return '—'
  try {
    const d = typeof date === 'string' ? parseISO(date) : date
    if (!isValid(d)) return '—'
    return format(d, 'MM/dd/yy')
  } catch {
    return '—'
  }
}

// Weight formatting
export function formatWeight(kg: number): string {
  const lbs = kg * 2.20462
  return `${formatNumber(Math.round(lbs))} lbs`
}

// Distance formatting
export function formatDistance(km: number): string {
  const miles = km * 0.621371
  return `${formatNumber(Math.round(miles))} mi`
}

// Phone formatting
export function formatPhone(phone: string | null | undefined): string {
  if (!phone) return '—'
  const digits = phone.replace(/\D/g, '')
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
  }
  if (digits.length === 11 && digits[0] === '1') {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`
  }
  return phone
}

// Truncate text
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength) + '…'
}

// Get initials
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

// Percentage change
export function getPercentageChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0
  return Math.round(((current - previous) / previous) * 100 * 10) / 10
}

// Debounce
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

// Generate random ID
export function generateId(): string {
  return Math.random().toString(36).slice(2, 9)
}

// Download CSV
export function downloadCSV(data: Record<string, unknown>[], filename: string): void {
  if (data.length === 0) return
  const headers = Object.keys(data[0])
  const rows = data.map(row =>
    headers.map(h => {
      const val = row[h]
      if (val == null) return ''
      const str = String(val)
      return str.includes(',') || str.includes('"') || str.includes('\n')
        ? `"${str.replace(/"/g, '""')}"`
        : str
    }).join(',')
  )
  const csv = [headers.join(','), ...rows].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${filename}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

// Status color mapping
export const statusColors: Record<string, string> = {
  // Order statuses
  draft: 'gray',
  pending: 'yellow',
  confirmed: 'blue',
  in_transit: 'purple',
  delivered: 'green',
  cancelled: 'red',
  on_hold: 'orange',
  // Driver statuses
  available: 'green',
  on_trip: 'blue',
  off_duty: 'gray',
  unavailable: 'red',
  // Vehicle statuses
  active: 'green',
  maintenance: 'yellow',
  inactive: 'gray',
  // Dispatch statuses
  queued: 'yellow',
  dispatched: 'blue',
  arrived: 'purple',
  completed: 'green',
}

// Get status label
export function getStatusLabel(status: string): string {
  return status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}
