import * as React from 'react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4 py-16 px-6 text-center',
        className
      )}
    >
      {icon && (
        <div
          className={cn(
            'flex items-center justify-center h-16 w-16 rounded-2xl',
            'bg-white/5 dark:bg-white/5 border border-[var(--border-color)] dark:border-white/10',
            'text-[var(--text-muted)]'
          )}
        >
          <span className="h-8 w-8">{icon}</span>
        </div>
      )}

      <div className="flex flex-col gap-1.5 max-w-xs">
        <h3 className="text-base font-semibold text-[var(--text-primary)]">
          {title}
        </h3>
        {description && (
          <p className="text-sm text-[var(--text-muted)] leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {action && (
        <Button
          variant="primary"
          size="sm"
          onClick={action.onClick}
          className="mt-2"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
};

EmptyState.displayName = 'EmptyState';

export { EmptyState };
