import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'type' | 'status' | 'default';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border',
        variant === 'default' && 'bg-gray-100 text-gray-800 border-gray-200',
        className
      )}
    >
      {children}
    </span>
  );
}
