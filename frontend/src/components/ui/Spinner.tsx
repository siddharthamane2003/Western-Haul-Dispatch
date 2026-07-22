import * as React from 'react';
import { cn } from '@/lib/utils';

type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg';
type SpinnerColor = 'default' | 'white' | 'blue';

const sizeMap: Record<SpinnerSize, string> = {
  xs: 'h-3 w-3 border-[1.5px]',
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-10 w-10 border-[3px]',
};

const colorMap: Record<SpinnerColor, string> = {
  default: 'border-[var(--text-muted)] border-t-[var(--text-primary)]',
  white: 'border-white/30 border-t-white',
  blue: 'border-blue-500/30 border-t-blue-500',
};

export interface SpinnerProps {
  size?: SpinnerSize;
  color?: SpinnerColor;
  fullScreen?: boolean;
  label?: string;
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  color = 'blue',
  fullScreen = false,
  label,
  className,
}) => {
  const spinner = (
    <div
      role="status"
      aria-label={label ?? 'Loading…'}
      className={cn('flex flex-col items-center justify-center gap-3', className)}
    >
      <div
        className={cn(
          'rounded-full animate-spin',
          sizeMap[size],
          colorMap[color]
        )}
      />
      {label && (
        <span className="text-sm text-[var(--text-muted)]">{label}</span>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        {spinner}
      </div>
    );
  }

  return spinner;
};

Spinner.displayName = 'Spinner';

export { Spinner };
