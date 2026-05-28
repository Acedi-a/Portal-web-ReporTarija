type PageHeaderProps = {
  eyebrow?: string
  title: string
  description?: string
}

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <div>
      {eyebrow ? <p className="text-sm font-medium text-blue-700 dark:text-zinc-400">{eyebrow}</p> : null}
      <h1 className="text-2xl font-semibold text-slate-950 dark:text-zinc-50">{title}</h1>
      {description ? <p className="text-sm text-slate-500 dark:text-zinc-400">{description}</p> : null}
    </div>
  )
}
