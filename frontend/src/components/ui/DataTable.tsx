import React from 'react'
import { cn } from '@/lib/utils'
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import type { TableColumn, SortConfig } from '@/types'

interface DataTableProps<T> {
  data: T[]
  columns: TableColumn<T>[]
  isLoading?: boolean
  pagination?: {
    page: number
    size: number
    total: number
    onPageChange: (page: number) => void
  }
  sortConfig?: SortConfig
  onSort?: (key: string) => void
  emptyMessage?: string
  stickyHeader?: boolean
  onRowClick?: (row: T) => void
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  isLoading = false,
  pagination,
  sortConfig,
  onSort,
  emptyMessage = 'No data available',
  stickyHeader = false,
  onRowClick,
}: DataTableProps<T>) {
  const handleSort = (column: TableColumn<T>) => {
    if (column.sortable && onSort) {
      onSort(column.key)
    }
  }

  const getSortIcon = (columnKey: string) => {
    if (!sortConfig || sortConfig.key !== columnKey) {
      return <ArrowUpDown className="w-3.5 h-3.5 ml-1.5 opacity-40 group-hover:opacity-80 transition-opacity" />
    }
    return sortConfig.direction === 'asc' ? (
      <ArrowUp className="w-3.5 h-3.5 ml-1.5 text-blue-500" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 ml-1.5 text-blue-500" />
    )
  }

  const renderSkeleton = () => {
    return Array.from({ length: pagination?.size || 5 }).map((_, rIdx) => (
      <tr key={`skeleton-row-${rIdx}`}>
        {columns.map((_, cIdx) => (
          <td key={`skeleton-cell-${cIdx}`} className="py-4 px-4 border-b border-subtle">
            <div className="h-4 rounded shimmer" />
          </td>
        ))}
      </tr>
    ))
  }

  const renderPagination = () => {
    if (!pagination) return null

    const { page, size, total, onPageChange } = pagination
    const totalPages = Math.max(1, Math.ceil(total / size))
    const start = (page - 1) * size + 1
    const end = Math.min(total, page * size)

    return (
      <div
        className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 border-t"
        style={{ borderColor: 'var(--border-color)', background: 'var(--card-bg)' }}
      >
        <p className="text-xs text-muted">
          Showing <span className="font-semibold text-primary">{total > 0 ? start : 0}</span> to{' '}
          <span className="font-semibold text-primary">{end}</span> of{' '}
          <span className="font-semibold text-primary">{total}</span> records
        </p>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1 || isLoading}
            className="px-3 py-1.5 rounded-lg border text-xs font-semibold select-none transition-colors hover:bg-surface-secondary disabled:opacity-40 disabled:pointer-events-none"
            style={{ color: 'var(--text-primary)', borderColor: 'var(--border-color)', background: 'var(--card-bg)' }}
          >
            Previous
          </button>
          
          {Array.from({ length: Math.min(5, totalPages) }).map((_, idx) => {
            let pageNum = page
            if (page <= 3) pageNum = idx + 1
            else if (page >= totalPages - 2) pageNum = totalPages - 4 + idx
            else pageNum = page - 2 + idx

            if (pageNum < 1 || pageNum > totalPages) return null

            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                disabled={isLoading}
                className={cn(
                  'w-8 h-8 rounded-lg text-xs font-semibold select-none transition-colors',
                  page === pageNum
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'border hover:bg-surface-secondary text-primary'
                )}
                style={
                  page === pageNum
                    ? {}
                    : { color: 'var(--text-primary)', borderColor: 'var(--border-color)', background: 'var(--card-bg)' }
                }
              >
                {pageNum}
              </button>
            )
          })}

          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages || isLoading}
            className="px-3 py-1.5 rounded-lg border text-xs font-semibold select-none transition-colors hover:bg-surface-secondary disabled:opacity-40 disabled:pointer-events-none"
            style={{ color: 'var(--text-primary)', borderColor: 'var(--border-color)', background: 'var(--card-bg)' }}
          >
            Next
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full overflow-hidden rounded-2xl border" style={{ borderColor: 'var(--border-color)', background: 'var(--card-bg)' }}>
      <div className="overflow-x-auto custom-scrollbar w-full">
        <table className="w-full border-collapse">
          <thead
            className={cn(
              stickyHeader && 'sticky top-0 z-10'
            )}
            style={{ background: 'var(--bg-secondary)' }}
          >
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col)}
                  className={cn(
                    'py-3 px-4 text-xs font-semibold uppercase tracking-wider select-none text-muted border-b border-subtle',
                    col.sortable && 'cursor-pointer hover:text-primary group transition-colors',
                    col.align === 'center' && 'text-center',
                    col.align === 'right' && 'text-right',
                    col.align !== 'center' && col.align !== 'right' && 'text-left'
                  )}
                  style={{ width: col.width }}
                >
                  <div className={cn(
                    'flex items-center',
                    col.align === 'center' && 'justify-center',
                    col.align === 'right' && 'justify-end'
                  )}>
                    {col.label}
                    {col.sortable && getSortIcon(col.key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              renderSkeleton()
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-8 px-4 text-center border-b border-subtle">
                  <p className="text-sm text-muted">{emptyMessage}</p>
                </td>
              </tr>
            ) : (
              data.map((row, rIdx) => (
                <tr
                  key={row.id || `row-${rIdx}`}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={cn(
                    'transition-colors border-b border-subtle last:border-b-0',
                    onRowClick && 'cursor-pointer hover:bg-surface-secondary'
                  )}
                >
                  {columns.map((col) => {
                    const value = row[col.key]
                    return (
                      <td
                        key={col.key}
                        className={cn(
                          'py-3 px-4 text-sm text-primary',
                          col.align === 'center' && 'text-center',
                          col.align === 'right' && 'text-right'
                        )}
                      >
                        {col.render ? col.render(value, row) : (value != null ? String(value) : '—')}
                      </td>
                    )
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {renderPagination()}
    </div>
  )
}
