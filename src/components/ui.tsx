import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react'
import { cn } from '../lib/utils'

export function Button({ className, variant = 'primary', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' | 'outline' }) {
  return <button className={cn('inline-flex min-h-9 items-center justify-center gap-2 rounded-lg px-3.5 py-2 text-sm font-semibold transition-[background-color,border-color,color,box-shadow,transform] duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50 disabled:active:translate-y-0', variant === 'primary' && 'bg-blue-600 text-white shadow-sm shadow-blue-600/20 hover:bg-blue-700 hover:shadow-md', variant === 'secondary' && 'bg-slate-100 text-slate-700 hover:bg-slate-200', variant === 'ghost' && 'text-slate-500 hover:bg-slate-100 hover:text-slate-800', variant === 'outline' && 'border border-slate-200 bg-white text-slate-700 shadow-sm hover:border-slate-300 hover:bg-slate-50', className)} {...props} />
}
export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) { return <div className={cn('rounded-xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03)]', className)} {...props} /> }
export function Badge({ children, className }: { children: ReactNode; className?: string }) { return <span className={cn('inline-flex items-center whitespace-nowrap rounded-full px-2 py-1 text-[11px] font-bold leading-none tracking-wide', className)}>{children}</span> }
export function ProgressBar({ value, className, color = 'bg-blue-600' }: { value: number; className?: string; color?: string }) { return <div className={cn('h-1.5 overflow-hidden rounded-full bg-slate-100', className)}><div className={cn('h-full rounded-full transition-[width] duration-700 ease-out', color)} style={{ width: `${Math.min(Math.max(value, 0) * 100, 100)}%` }} /></div> }
export function Skeleton({ className }: { className?: string }) { return <div aria-hidden="true" className={cn('animate-pulse rounded-lg bg-gradient-to-r from-slate-100 via-slate-200/70 to-slate-100', className)} /> }


export { Button }