import React from 'react'
import * as Popover from '@radix-ui/react-popover'
import { Calendar as CalendarIcon, X } from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'

interface DatePickerProps {
  value: string | undefined
  onChange: (value: string) => void
  label?: string
  error?: string
  min?: string
  max?: string
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function DatePicker({
  value,
  onChange,
  label,
  error,
  min,
  max,
  placeholder = 'Select date',
  disabled = false,
  className,
}: DatePickerProps) {
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange('')
  }

  return (
    <div className={cn('flex flex-col gap-1.5 w-full', className)}>
      {label && (
        <label className="text-xs font-semibold select-none" style={{ color: 'var(--text-secondary)' }}>
          {label}
        </label>
      )}

      <Popover.Root>
        <Popover.Trigger asChild>
          <button
            type="button"
            disabled={disabled}
            className={cn(
              'form-input flex items-center justify-between text-left h-10',
              error && 'border-red-500 focus:border-red-500',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            <span className={cn('truncate', !value && 'text-muted')}>
              {value ? formatDate(value) : placeholder}
            </span>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {value && !disabled && (
                <span
                  onClick={handleClear}
                  className="p-0.5 rounded-lg hover:bg-surface-tertiary transition-colors"
                  role="button"
                  tabIndex={0}
                >
                  <X className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
                </span>
              )}
              <CalendarIcon className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
            </div>
          </button>
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Content
            align="start"
            sideOffset={4}
            className="rounded-2xl border p-4 shadow-lg focus:outline-none animate-scale-in z-50 flex flex-col items-center"
            style={{
              background: 'var(--card-bg)',
              borderColor: 'var(--border-color)',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            <input
              type="date"
              value={value || ''}
              min={min}
              max={max}
              disabled={disabled}
              onChange={(e) => onChange(e.target.value)}
              className="form-input text-sm outline-none border focus:border-blue-500"
              style={{
                background: 'var(--bg-secondary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
            />
            <div className="text-[10px] text-muted mt-2 text-center w-full">
              Use system calendar popup above to select a date.
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>

      {error && <p className="text-xs text-red-500 font-medium select-none">{error}</p>}
    </div>
  )
}
export default DatePicker
