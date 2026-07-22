import * as React from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { cn } from '@/lib/utils';

export interface DropdownItem {
  label?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  danger?: boolean;
  disabled?: boolean;
  separator?: boolean;
}

export interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'bottom' | 'left' | 'right';
  sideOffset?: number;
  className?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  items,
  align = 'end',
  side = 'bottom',
  sideOffset = 6,
  className,
}) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>{trigger}</DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align={align}
          side={side}
          sideOffset={sideOffset}
          className={cn(
            'z-50 min-w-[180px] overflow-hidden rounded-xl border p-1.5',
            'bg-[var(--card-bg)] text-[var(--text-primary)] shadow-xl',
            'border-[var(--border-color)]',
            'dark:bg-gray-900 dark:border-white/10',
            'backdrop-blur-xl',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            'data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2',
            'data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2',
            'duration-150',
            className
          )}
        >
          {items.map((item, index) => {
            if (item.separator) {
              return (
                <DropdownMenu.Separator
                  key={`sep-${index}`}
                  className="my-1 h-px bg-[var(--border-color)] dark:bg-white/10"
                />
              );
            }

            return (
              <DropdownMenu.Item
                key={`item-${index}`}
                disabled={item.disabled}
                onSelect={() => item.onClick?.()}
                className={cn(
                  'relative flex cursor-pointer select-none items-center gap-2.5 rounded-lg px-3 py-2 text-sm',
                  'outline-none transition-colors duration-100',
                  'focus:bg-white/8 dark:focus:bg-white/8',
                  item.danger
                    ? 'text-red-500 focus:bg-red-500/10 focus:text-red-400'
                    : 'text-[var(--text-primary)] focus:text-[var(--text-primary)]',
                  item.disabled && 'opacity-50 cursor-not-allowed pointer-events-none'
                )}
              >
                {item.icon && (
                  <span
                    className={cn(
                      'flex-shrink-0 h-4 w-4',
                      item.danger ? 'text-red-500' : 'text-[var(--text-muted)]'
                    )}
                  >
                    {item.icon}
                  </span>
                )}
                {item.label}
              </DropdownMenu.Item>
            );
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

Dropdown.displayName = 'Dropdown';

export { Dropdown };
