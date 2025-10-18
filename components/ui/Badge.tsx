import * as React from 'react'
import { cn } from '@/lib/utils'

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'outline'
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variants = {
      default:
        'bg-slate-800/50 text-slate-300 border border-slate-700/30',
      primary:
        'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20',
      success:
        'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
      warning:
        'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
      error:
        'bg-red-500/10 text-red-400 border border-red-500/20',
      outline:
        'border border-slate-600 text-slate-300',
    }

    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
          variants[variant],
          className
        )}
        {...props}
      />
    )
  }
)

Badge.displayName = 'Badge'

export { Badge }
