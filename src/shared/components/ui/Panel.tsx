import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../../../lib/utils'

type PanelProps = HTMLAttributes<HTMLElement> & {
  as?: 'section' | 'article' | 'div'
  children: ReactNode
}

export function Panel({ as: Component = 'section', className, children, ...props }: PanelProps) {
  return (
    <Component
      className={cn('rounded-lg border border-slate-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900', className)}
      {...props}
    >
      {children}
    </Component>
  )
}
