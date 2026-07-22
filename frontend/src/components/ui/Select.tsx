import * as React from 'react';
import * as RadixSelect from '@radix-ui/react-select';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  containerClassName?: string;
  id?: string;
}

const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option…',
  label,
  error,
  disabled = false,
  className,
  containerClassName,
  id,
}) => {
  const selectId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={cn('flex flex-col gap-1.5 w-full', containerClassName)}>
      {label && (
        <label
          htmlFor={selectId}
          className="text-sm font-medium text-[var(--text-secondary)] leading-none"
        >
          {label}
        </label>
      )}

      <RadixSelect.Root
        value={value}
        onValueChange={onChange}
        disabled={disabled}
      >
        <RadixSelect.Trigger
          id={selectId}
          className={cn(
            'flex h-10 w-full items-center justify-between rounded-lg border px-3 py-2 text-sm',
            'bg-[var(--card-bg)] text-[var(--text-primary)]',
            'border-[var(--border-color)]',
            'dark:bg-white/5 dark:border-white/10',
            'transition-all duration-150',
            'focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'data-[placeholder]:text-[var(--text-muted)]',
            error && 'border-red-500 focus:ring-red-500/50',
            className
          )}
        >
          <RadixSelect.Value placeholder={placeholder} />
          <RadixSelect.Icon>
            <ChevronDown className="h-4 w-4 text-[var(--text-muted)] opacity-70" />
          </RadixSelect.Icon>
        </RadixSelect.Trigger>

        <RadixSelect.Portal>
          <RadixSelect.Content
            className={cn(
              'relative z-50 min-w-[8rem] overflow-hidden rounded-xl border',
              'bg-[var(--card-bg)] text-[var(--text-primary)] shadow-xl',
              'border-[var(--border-color)]',
              'dark:bg-gray-900 dark:border-white/10',
              'backdrop-blur-xl',
              'data-[state=open]:animate-in data-[state=closed]:animate-out',
              'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
              'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
              'data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2'
            )}
            position="popper"
            sideOffset={6}
          >
            <RadixSelect.ScrollUpButton className="flex cursor-default items-center justify-center py-1 text-[var(--text-muted)]">
              <ChevronUp className="h-4 w-4" />
            </RadixSelect.ScrollUpButton>

            <RadixSelect.Viewport className="p-1.5">
              {options.map((option) => (
                <RadixSelect.Item
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                  className={cn(
                    'relative flex w-full cursor-pointer select-none items-center rounded-md py-2 pl-8 pr-3 text-sm',
                    'text-[var(--text-primary)]',
                    'outline-none',
                    'transition-colors duration-100',
                    'focus:bg-blue-500/10 focus:text-blue-400',
                    'data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed',
                    'data-[state=checked]:text-blue-400'
                  )}
                >
                  <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                    <RadixSelect.ItemIndicator>
                      <Check className="h-4 w-4 text-blue-500" />
                    </RadixSelect.ItemIndicator>
                  </span>
                  <RadixSelect.ItemText>{option.label}</RadixSelect.ItemText>
                </RadixSelect.Item>
              ))}
            </RadixSelect.Viewport>

            <RadixSelect.ScrollDownButton className="flex cursor-default items-center justify-center py-1 text-[var(--text-muted)]">
              <ChevronDown className="h-4 w-4" />
            </RadixSelect.ScrollDownButton>
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>

      {error && (
        <p className="text-xs text-red-500 mt-0.5">{error}</p>
      )}
    </div>
  );
};

Select.displayName = 'Select';

export { Select };
