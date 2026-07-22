import React from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { BreadcrumbItem } from '@/types'

interface PageHeaderProps {
  title: string
  description?: string
  breadcrumbs?: BreadcrumbItem[]
  actions?: React.ReactNode
  className?: string
}

export function PageHeader({ title, description, breadcrumbs, actions, className }: PageHeaderProps) {
  return (
    <div className={cn('flex items-start justify-between gap-4 mb-6', className)}>
      <div>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1 mb-1.5">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && (
                  <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
                )}
                {crumb.href && idx < breadcrumbs.length - 1 ? (
                  <Link
                    to={crumb.href}
                    className="text-xs font-medium transition-colors hover:text-blue-400"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span
                    className="text-xs font-medium"
                    style={{ color: idx === breadcrumbs.length - 1 ? 'var(--text-secondary)' : 'var(--text-muted)' }}
                  >
                    {crumb.label}
                  </span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}
        <h1
          className="text-xl font-bold"
          style={{ color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}
        >
          {title}
        </h1>
        {description && (
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>
      )}
    </div>
  )
}
