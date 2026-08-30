import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react'
import { cn } from '../lib/utils'

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100',
        size === 'sm' && 'min-h-7 px-2.5 py-1 text-xs',
        size === 'md' && 'min-h-9 px-3.5 py-1.5 text-xs',
        size === 'lg' && 'min-h-11 px-5 py-2.5 text-sm',
        variant === 'primary' &&
          'bg-[#007df0] text-white shadow-sm shadow-blue-600/25 hover:bg-[#006bd1] hover:shadow-md hover:shadow-blue-600/30',
        variant === 'secondary' && 'bg-slate-100 text-slate-700 hover:bg-slate-200/80 hover:text-slate-900',
        variant === 'ghost' && 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
        variant === 'outline' &&
          'border border-slate-300/90 bg-white text-slate-700 shadow-xs hover:border-slate-400 hover:bg-slate-50 hover:text-slate-900',
        variant === 'danger' && 'bg-rose-600 text-white shadow-xs hover:bg-rose-700',
        className
      )}
      {...props}
    />
  )
}

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-xl border border-slate-200/90 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.04)] transition-all',
        className
      )}
      {...props}
    />
  )
}

export function Badge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center whitespace-nowrap rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-semibold leading-tight text-slate-700 tracking-tight',
        className
      )}
    >
      {children}
    </span>
  )
}

export function ProgressBar({
  value,
  className,
  color = 'bg-[#007df0]',
}: {
  value: number
  className?: string
  color?: string
}) {
  return (
    <div className={cn('h-1.5 overflow-hidden rounded-full bg-slate-100', className)}>
      <div
        className={cn('h-full rounded-full transition-[width] duration-700 ease-out', color)}
        style={{ width: `${Math.min(Math.max(value, 0) * 100, 100)}%` }}
      />
    </div>
  )
}

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn('animate-pulse rounded-lg bg-gradient-to-r from-slate-100 via-slate-200/70 to-slate-100', className)}
    />
  )
}