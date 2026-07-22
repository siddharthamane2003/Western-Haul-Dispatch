import * as React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

const sizeClasses: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
  full: 'max-w-[95vw] h-[90vh]',
};

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  size?: ModalSize;
  className?: string;
  hideCloseButton?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  className,
  hideCloseButton = false,
}) => {
  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        {/* Overlay */}
        <Dialog.Overlay
          className={cn(
            'fixed inset-0 z-50 bg-black/60 backdrop-blur-sm',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0'
          )}
        />

        {/* Content */}
        <Dialog.Content
          className={cn(
            'fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2',
            'w-full rounded-2xl border shadow-2xl',
            'bg-[var(--card-bg)] border-[var(--border-color)]',
            'dark:bg-gray-900 dark:border-white/10',
            'flex flex-col',
            'focus:outline-none',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-100',
            'data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]',
            'data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]',
            'duration-200',
            sizeClasses[size],
            size === 'full' && 'overflow-hidden',
            className
          )}
        >
          {/* Header */}
          {(title || !hideCloseButton) && (
            <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-[var(--border-color)] dark:border-white/10 flex-shrink-0">
              <div className="flex flex-col gap-1">
                {title && (
                  <Dialog.Title className="text-lg font-semibold text-[var(--text-primary)] leading-tight">
                    {title}
                  </Dialog.Title>
                )}
                {description && (
                  <Dialog.Description className="text-sm text-[var(--text-muted)]">
                    {description}
                  </Dialog.Description>
                )}
              </div>
              {!hideCloseButton && (
                <Dialog.Close asChild>
                  <button
                    onClick={onClose}
                    className={cn(
                      'flex-shrink-0 rounded-lg p-1.5',
                      'text-[var(--text-muted)] hover:text-[var(--text-primary)]',
                      'hover:bg-white/10 dark:hover:bg-white/10',
                      'transition-colors duration-150',
                      'focus:outline-none focus:ring-2 focus:ring-blue-500/50'
                    )}
                    aria-label="Close modal"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </Dialog.Close>
              )}
            </div>
          )}

          {/* Body */}
          <div
            className={cn(
              'flex-1 px-6 py-5 text-[var(--text-primary)]',
              size === 'full' && 'overflow-y-auto'
            )}
          >
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[var(--border-color)] dark:border-white/10 flex-shrink-0">
              {footer}
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

Modal.displayName = 'Modal';

export { Modal };
