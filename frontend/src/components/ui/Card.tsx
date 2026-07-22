import * as React from 'react';
import { cn } from '@/lib/utils';

type CardVariant = 'default' | 'elevated' | 'glass' | 'gradient-border';
type CardPadding = 'none' | 'sm' | 'md' | 'lg';

const paddingMap: Record<CardPadding, string> = {
  none: '',
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-6',
};

const variantMap: Record<CardVariant, string> = {
  default: [
    'bg-[var(--card-bg)] border border-[var(--border-color)]',
    'dark:bg-white/5 dark:border-white/10',
  ].join(' '),
  elevated: [
    'bg-[var(--card-bg)] border border-[var(--border-color)]',
    'dark:bg-white/5 dark:border-white/10',
    'shadow-xl shadow-black/20',
  ].join(' '),
  glass: [
    'bg-white/5 backdrop-blur-xl border border-white/10',
    'dark:bg-white/[0.03]',
    'shadow-xl shadow-black/20',
  ].join(' '),
  'gradient-border': [
    'relative bg-[var(--card-bg)]',
    'dark:bg-gray-900',
    'before:absolute before:inset-0 before:rounded-[inherit] before:p-px',
    'before:bg-gradient-to-br before:from-blue-500/40 before:via-purple-500/20 before:to-transparent',
    'before:-z-10',
    'shadow-lg shadow-blue-500/10',
  ].join(' '),
};

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: CardPadding;
  title?: string;
  description?: string;
  headerAction?: React.ReactNode;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = 'default',
      padding = 'md',
      title,
      description,
      headerAction,
      children,
      ...props
    },
    ref
  ) => {
    const hasHeader = title || description || headerAction;

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-2xl overflow-hidden transition-all duration-200',
          variantMap[variant],
          className
        )}
        {...props}
      >
        {hasHeader && (
          <div
            className={cn(
              'flex items-start justify-between gap-4',
              'border-b border-[var(--border-color)] dark:border-white/10',
              paddingMap[padding],
              padding !== 'none' && 'pb-4'
            )}
          >
            <div className="flex flex-col gap-1 min-w-0">
              {title && (
                <h3 className="text-base font-semibold text-[var(--text-primary)] truncate">
                  {title}
                </h3>
              )}
              {description && (
                <p className="text-sm text-[var(--text-muted)]">{description}</p>
              )}
            </div>
            {headerAction && (
              <div className="flex-shrink-0">{headerAction}</div>
            )}
          </div>
        )}

        <div
          className={cn(
            paddingMap[padding],
            hasHeader && padding !== 'none' && 'pt-4'
          )}
        >
          {children}
        </div>
      </div>
    );
  }
);

Card.displayName = 'Card';

// Sub-components for flexibility
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col gap-1 pb-4', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'text-base font-semibold text-[var(--text-primary)]',
      className
    )}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('text-[var(--text-primary)]', className)} {...props} />
));
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex items-center pt-4 border-t border-[var(--border-color)] dark:border-white/10',
      className
    )}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardTitle, CardContent, CardFooter };
