import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react'
import { cn } from '../lib/utils'

export function Button({ className, variant = 'primary', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' | 'outline' }) {
  return <button className={cn('inline-flex items-center justify-center gap-2 rounded-md px-3.5 py-2 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-50', variant === 'primary' && 'bg-blue-600 text-white shadow-sm hover:bg-blue-700', variant === 'secondary' && 'bg-slate-100 text-slate-700 hover:bg-slate-200', variant === 'ghost' && 'text-slate-500 hover:bg-slate-100 hover:text-slate-800', variant === 'outline' && 'border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50', className)} {...props} />
}
export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) { return <div className={cn('border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03)]', className)} {...props} /> }
export function Badge({ children, className }: { children: ReactNode; className?: string }) { return <span className={cn('inline-flex items-center rounded-full px-2 py-1 text-[11px] font-bold tracking-wide', className)}>{children}</span> }
export function ProgressBar({ value, className, color = 'bg-blue-600' }: { value: number; className?: string; color?: string }) { return <div className={cn('h-1.5 overflow-hidden rounded-full bg-slate-100', className)}><div className={cn('h-full rounded-full transition-all duration-700', color)} style={{ width: `${Math.min(value * 100, 100)}%` }} /></div> }
export function Skeleton({ className }: { className?: string }) { return <div className={cn('animate-pulse rounded bg-slate-100', className)} /> }
