import * as React from 'react';
import * as RadixAvatar from '@radix-ui/react-avatar';
import { cn } from '@/lib/utils';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type AvatarStatus = 'online' | 'away' | 'offline';

const sizeMap: Record<AvatarSize, string> = {
  xs: 'h-6 w-6 text-xs',
  sm: 'h-8 w-8 text-sm',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-lg',
};

const statusSizeMap: Record<AvatarSize, string> = {
  xs: 'h-1.5 w-1.5 border',
  sm: 'h-2 w-2 border',
  md: 'h-2.5 w-2.5 border-[1.5px]',
  lg: 'h-3 w-3 border-2',
  xl: 'h-3.5 w-3.5 border-2',
};

const statusColorMap: Record<AvatarStatus, string> = {
  online: 'bg-emerald-500',
  away: 'bg-amber-500',
  offline: 'bg-gray-400',
};

// Gradient backgrounds for initials fallback — assigned deterministically
const gradients = [
  'from-blue-500 to-indigo-600',
  'from-purple-500 to-pink-600',
  'from-emerald-500 to-teal-600',
  'from-orange-500 to-red-600',
  'from-cyan-500 to-blue-600',
  'from-rose-500 to-pink-600',
  'from-violet-500 to-purple-600',
];

function getGradient(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return gradients[Math.abs(hash) % gradients.length];
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export interface AvatarProps {
  src?: string;
  name?: string;
  size?: AvatarSize;
  status?: AvatarStatus;
  className?: string;
  alt?: string;
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  name = '',
  size = 'md',
  status,
  className,
  alt,
}) => {
  const gradient = name ? getGradient(name) : gradients[0];
  const initials = name ? getInitials(name) : '?';

  return (
    <div className={cn('relative inline-flex flex-shrink-0', className)}>
      <RadixAvatar.Root
        className={cn(
          'inline-flex items-center justify-center rounded-full overflow-hidden select-none',
          sizeMap[size]
        )}
      >
        <RadixAvatar.Image
          src={src}
          alt={alt ?? name}
          className="h-full w-full object-cover"
        />
        <RadixAvatar.Fallback
          delayMs={src ? 300 : 0}
          className={cn(
            'flex h-full w-full items-center justify-center rounded-full',
            'bg-gradient-to-br font-semibold text-white',
            gradient
          )}
        >
          {initials}
        </RadixAvatar.Fallback>
      </RadixAvatar.Root>

      {status && (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full border-[var(--bg-primary)]',
            statusSizeMap[size],
            statusColorMap[status]
          )}
          title={status}
        />
      )}
    </div>
  );
};

Avatar.displayName = 'Avatar';

export { Avatar };
