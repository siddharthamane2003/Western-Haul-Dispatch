import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      containerClassName,
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      type = 'text',
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className={cn('flex flex-col gap-1.5 w-full', containerClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-[var(--text-secondary)] leading-none"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center w-full">
          {leftIcon && (
            <span className="absolute left-3 flex items-center justify-center text-[var(--text-muted)] pointer-events-none">
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            type={type}
            disabled={disabled}
            className={cn(
              'w-full h-10 rounded-lg border bg-[var(--card-bg)] text-[var(--text-primary)] text-sm',
              'px-3 py-2 placeholder:text-[var(--text-muted)]',
              'border-[var(--border-color)]',
              'transition-all duration-150',
              'focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'dark:bg-white/5 dark:border-white/10',
              'dark:focus:border-blue-400',
              error && 'border-red-500 focus:ring-red-500/50 focus:border-red-500',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              className
            )}
            {...props}
          />

          {rightIcon && (
            <span className="absolute right-3 flex items-center justify-center text-[var(--text-muted)]">
              {rightIcon}
            </span>
          )}
        </div>

        {error && (
          <p className="text-xs text-red-500 flex items-center gap-1 mt-0.5">
            {error}
          </p>
        )}

        {!error && helperText && (
          <p className="text-xs text-[var(--text-muted)] mt-0.5">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
