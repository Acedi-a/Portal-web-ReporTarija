import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../../lib/utils'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'

const buttonClasses: Record<ButtonVariant, string> = {
  primary: 'bg-blue-700 text-white hover:bg-blue-800',
  secondary:
    'border border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800',
  ghost: 'text-blue-700 hover:text-blue-900 dark:text-zinc-300 dark:hover:text-zinc-100',
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  children: ReactNode
}

export function Button({ className, variant = 'primary', type = 'button', children, ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium transition disabled:opacity-60',
        buttonClasses[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
