import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 font-medium rounded-full border transition-colors duration-150',
  {
    variants: {
      variant: {
        blue: 'bg-blue-500/15 text-blue-400 border-blue-500/25 dark:bg-blue-500/10 dark:text-blue-300',
        green: 'bg-emerald-500/15 text-emerald-500 border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-400',
        yellow: 'bg-amber-500/15 text-amber-500 border-amber-500/25 dark:bg-amber-500/10 dark:text-amber-400',
        red: 'bg-red-500/15 text-red-500 border-red-500/25 dark:bg-red-500/10 dark:text-red-400',
        purple: 'bg-purple-500/15 text-purple-500 border-purple-500/25 dark:bg-purple-500/10 dark:text-purple-400',
        gray: 'bg-gray-500/15 text-gray-400 border-gray-500/25 dark:bg-gray-500/10 dark:text-gray-400',
        orange: 'bg-orange-500/15 text-orange-500 border-orange-500/25 dark:bg-orange-500/10 dark:text-orange-400',
      },
      size: {
        sm: 'text-xs px-2 py-0.5',
        md: 'text-sm px-2.5 py-0.5',
      },
    },
    defaultVariants: {
      variant: 'blue',
      size: 'sm',
    },
  }
);

const dotColorMap: Record<string, string> = {
  blue: 'bg-blue-400',
  green: 'bg-emerald-500',
  yellow: 'bg-amber-500',
  red: 'bg-red-500',
  purple: 'bg-purple-500',
  gray: 'bg-gray-400',
  orange: 'bg-orange-500',
};

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'blue',
  size = 'sm',
  dot = false,
  children,
  ...props
}) => {
  return (
    <span
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            'inline-block rounded-full flex-shrink-0',
            size === 'sm' ? 'h-1.5 w-1.5' : 'h-2 w-2',
            dotColorMap[variant ?? 'blue']
          )}
        />
      )}
      {children}
    </span>
  );
};

Badge.displayName = 'Badge';

export { Badge, badgeVariants };
