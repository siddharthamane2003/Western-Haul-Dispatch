import * as React from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  placeholder?: string;
  className?: string;
  shortcut?: boolean;
  autoFocus?: boolean;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onClear,
  placeholder = 'Search…',
  className,
  shortcut = true,
  autoFocus = false,
  onKeyDown,
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const hasValue = value.length > 0;

  // Ctrl+K / Cmd+K global focus
  React.useEffect(() => {
    if (!shortcut) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcut]);

  const handleClear = () => {
    onChange('');
    onClear?.();
    inputRef.current?.focus();
  };

  return (
    <div
      className={cn(
        'relative flex items-center group w-full',
        className
      )}
    >
      {/* Search icon */}
      <Search
        className={cn(
          'absolute left-3 h-4 w-4 pointer-events-none',
          'text-[var(--text-muted)]',
          'transition-colors duration-150',
          'group-focus-within:text-blue-400'
        )}
      />

      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        autoFocus={autoFocus}
        placeholder={placeholder}
        className={cn(
          'w-full h-10 pl-10 text-sm rounded-xl border',
          'bg-[var(--card-bg)] text-[var(--text-primary)]',
          'border-[var(--border-color)]',
          'dark:bg-white/5 dark:border-white/10',
          'placeholder:text-[var(--text-muted)]',
          'transition-all duration-150',
          'focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500',
          shortcut && !hasValue ? 'pr-24' : 'pr-10'
        )}
      />

      {/* Right side: shortcut hint or clear button */}
      <div className="absolute right-3 flex items-center gap-1.5">
        {hasValue ? (
          <button
            type="button"
            onClick={handleClear}
            className={cn(
              'flex items-center justify-center h-5 w-5 rounded-md',
              'text-[var(--text-muted)] hover:text-[var(--text-primary)]',
              'hover:bg-white/10 dark:hover:bg-white/10',
              'transition-colors duration-100',
              'focus:outline-none focus:ring-1 focus:ring-blue-500/50'
            )}
            aria-label="Clear search"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        ) : (
          shortcut && (
            <div className="hidden sm:flex items-center gap-0.5 pointer-events-none">
              <kbd className="inline-flex items-center justify-center h-5 min-w-[1.25rem] px-1 rounded border text-[10px] font-medium text-[var(--text-muted)] bg-white/5 border-[var(--border-color)] dark:border-white/10">
                Ctrl
              </kbd>
              <kbd className="inline-flex items-center justify-center h-5 min-w-[1.25rem] px-1 rounded border text-[10px] font-medium text-[var(--text-muted)] bg-white/5 border-[var(--border-color)] dark:border-white/10">
                K
              </kbd>
            </div>
          )
        )}
      </div>
    </div>
  );
};

SearchBar.displayName = 'SearchBar';

export { SearchBar };
