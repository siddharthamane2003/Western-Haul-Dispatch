import * as React from 'react';
import * as RadixTooltip from '@radix-ui/react-tooltip';
import { cn } from '@/lib/utils';

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
  delayDuration?: number;
  className?: string;
  sideOffset?: number;
}

const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  side = 'top',
  align = 'center',
  delayDuration = 300,
  className,
  sideOffset = 6,
}) => {
  return (
    <RadixTooltip.Provider delayDuration={delayDuration}>
      <RadixTooltip.Root>
        <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>

        <RadixTooltip.Portal>
          <RadixTooltip.Content
            side={side}
            align={align}
            sideOffset={sideOffset}
            className={cn(
              'z-50 max-w-xs rounded-lg px-3 py-1.5 text-xs font-medium',
              'bg-gray-900 text-white border border-white/10 shadow-xl',
              'dark:bg-gray-800 dark:border-white/10',
              'backdrop-blur-xl',
              'select-none',
              'data-[state=delayed-open]:animate-in data-[state=closed]:animate-out',
              'data-[state=closed]:fade-out-0 data-[state=delayed-open]:fade-in-0',
              'data-[state=closed]:zoom-out-95 data-[state=delayed-open]:zoom-in-95',
              'data-[side=bottom]:slide-in-from-top-1 data-[side=top]:slide-in-from-bottom-1',
              'data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1',
              'duration-100',
              className
            )}
          >
            {content}
            <RadixTooltip.Arrow className="fill-gray-900 dark:fill-gray-800" />
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
};

Tooltip.displayName = 'Tooltip';

export { Tooltip };
