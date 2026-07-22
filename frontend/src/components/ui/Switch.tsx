import * as React from 'react';
import * as RadixSwitch from '@radix-ui/react-switch';
import { cn } from '@/lib/utils';

export interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  id?: string;
  className?: string;
}

const Switch: React.FC<SwitchProps> = ({
  checked,
  onCheckedChange,
  label,
  description,
  disabled = false,
  id,
  className,
}) => {
  const switchId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div
      className={cn(
        'flex items-center gap-3',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      <RadixSwitch.Root
        id={switchId}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        className={cn(
          'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent',
          'transition-colors duration-200 ease-in-out',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent',
          'disabled:cursor-not-allowed',
          'data-[state=checked]:bg-blue-600',
          'data-[state=unchecked]:bg-white/15 dark:data-[state=unchecked]:bg-white/10'
        )}
      >
        <RadixSwitch.Thumb
          className={cn(
            'pointer-events-none block h-5 w-5 rounded-full bg-white shadow-md',
            'ring-0 transition-transform duration-200 ease-in-out',
            'data-[state=checked]:translate-x-5',
            'data-[state=unchecked]:translate-x-0'
          )}
        />
      </RadixSwitch.Root>

      {(label || description) && (
        <div className="flex flex-col gap-0.5">
          {label && (
            <label
              htmlFor={switchId}
              className={cn(
                'text-sm font-medium text-[var(--text-primary)] leading-none',
                !disabled && 'cursor-pointer'
              )}
            >
              {label}
            </label>
          )}
          {description && (
            <span className="text-xs text-[var(--text-muted)]">
              {description}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

Switch.displayName = 'Switch';

export { Switch };
