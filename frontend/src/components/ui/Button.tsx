import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium',
    'transition-all duration-200 ease-in-out',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent',
    'disabled:pointer-events-none disabled:opacity-50',
    'select-none',
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-gradient-to-r from-blue-600 to-purple-600',
          'text-white shadow-md shadow-blue-500/25',
          'hover:from-blue-500 hover:to-purple-500 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-px',
          'active:translate-y-0 active:shadow-md',
        ],
        secondary: [
          'bg-white/10 dark:bg-white/10 text-[var(--text-primary)]',
          'border border-[var(--border-color)]',
          'hover:bg-white/20 dark:hover:bg-white/15 hover:-translate-y-px',
          'active:translate-y-0',
          'backdrop-blur-sm',
        ],
        outline: [
          'border border-blue-500 text-blue-500',
          'bg-transparent',
          'hover:bg-blue-500/10 hover:-translate-y-px',
          'active:translate-y-0',
        ],
        ghost: [
          'bg-transparent text-[var(--text-primary)]',
          'hover:bg-white/10 dark:hover:bg-white/10',
          'active:bg-white/15',
        ],
        danger: [
          'bg-gradient-to-r from-red-600 to-rose-600',
          'text-white shadow-md shadow-red-500/25',
          'hover:from-red-500 hover:to-rose-500 hover:shadow-lg hover:shadow-red-500/30 hover:-translate-y-px',
          'active:translate-y-0',
        ],
      },
      size: {
        sm: 'h-8 px-3 text-xs rounded-md',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base rounded-xl',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      loading = false,
      leftIcon,
      rightIcon,
      asChild = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          leftIcon && <span className="flex-shrink-0">{leftIcon}</span>
        )}
        {children}
        {!loading && rightIcon && (
          <span className="flex-shrink-0">{rightIcon}</span>
        )}
      </Comp>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
