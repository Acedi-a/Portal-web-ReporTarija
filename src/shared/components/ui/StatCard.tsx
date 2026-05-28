import type { LucideIcon } from 'lucide-react'
import { Panel } from './Panel'

type StatCardProps = {
  icon: LucideIcon
  label: string
  value: number
}

export function StatCard({ icon: Icon, label, value }: StatCardProps) {
  return (
    <Panel as="div">
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-500 dark:text-zinc-400">{label}</span>
        <Icon className="h-5 w-5 text-blue-700 dark:text-zinc-300" />
      </div>
      <p className="mt-3 text-3xl font-semibold text-slate-950 dark:text-zinc-50">{value}</p>
    </Panel>
  )
}
