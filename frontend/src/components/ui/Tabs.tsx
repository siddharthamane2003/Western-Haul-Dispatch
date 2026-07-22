import * as React from 'react';
import * as RadixTabs from '@radix-ui/react-tabs';
import { cn } from '@/lib/utils';

export interface TabItem {
  label: string;
  value: string;
  count?: number;
  icon?: React.ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  value: string;
  onChange: (value: string) => void;
  children?: React.ReactNode;
  className?: string;
  listClassName?: string;
}

const Tabs: React.FC<TabsProps> = ({
  tabs,
  value,
  onChange,
  children,
  className,
  listClassName,
}) => {
  return (
    <RadixTabs.Root
      value={value}
      onValueChange={onChange}
      className={cn('flex flex-col', className)}
    >
      <RadixTabs.List
        className={cn(
          'flex items-center gap-1 border-b border-[var(--border-color)] dark:border-white/10',
          'overflow-x-auto scrollbar-none',
          listClassName
        )}
      >
        {tabs.map((tab) => (
          <RadixTabs.Trigger
            key={tab.value}
            value={tab.value}
            className={cn(
              'relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium',
              'text-[var(--text-muted)] whitespace-nowrap',
              'transition-colors duration-150 outline-none',
              'hover:text-[var(--text-primary)]',
              'data-[state=active]:text-blue-400',
              // Active indicator underline
              'after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:rounded-t-full',
              'after:bg-transparent after:transition-colors after:duration-150',
              'data-[state=active]:after:bg-blue-500',
              'focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:rounded-t-lg'
            )}
          >
            {tab.icon && (
              <span className="flex-shrink-0 h-4 w-4">{tab.icon}</span>
            )}
            {tab.label}
            {tab.count !== undefined && (
              <span
                className={cn(
                  'inline-flex items-center justify-center rounded-full px-1.5 py-0.5 text-xs font-medium min-w-[1.25rem]',
                  'bg-[var(--border-color)] text-[var(--text-muted)]',
                  'dark:bg-white/10',
                  'transition-colors duration-150',
                  'group-data-[state=active]:bg-blue-500/20 group-data-[state=active]:text-blue-400'
                )}
              >
                {tab.count}
              </span>
            )}
          </RadixTabs.Trigger>
        ))}
      </RadixTabs.List>

      {children && (
        <div className="flex-1 pt-4">
          {tabs.map((tab) => (
            <RadixTabs.Content
              key={tab.value}
              value={tab.value}
              className={cn(
                'outline-none',
                'data-[state=active]:animate-in data-[state=inactive]:animate-out',
                'data-[state=active]:fade-in-0 data-[state=inactive]:fade-out-0',
                'duration-150'
              )}
            >
              {/* Content is passed by consumer using RadixTabs.Content directly, or children are rendered per-tab */}
            </RadixTabs.Content>
          ))}
          {children}
        </div>
      )}
    </RadixTabs.Root>
  );
};

Tabs.displayName = 'Tabs';

// Export Radix primitives for direct use
const TabsContent = RadixTabs.Content;

export { Tabs, TabsContent };
