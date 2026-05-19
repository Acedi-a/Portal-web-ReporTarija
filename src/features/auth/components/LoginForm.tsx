import type { FormEvent } from 'react'
import type { LoginFormValues } from '../validations/loginSchema'

type LoginFormProps = {
  values: LoginFormValues
  error: string
  isSubmitting: boolean
  onFieldChange: (name: keyof LoginFormValues, value: string) => void
  onSubmit: () => void
  onEnterDemo: () => void
}

export function LoginForm({
  values,
  error,
  isSubmitting,
  onFieldChange,
  onSubmit,
  onEnterDemo,
}: LoginFormProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSubmit()
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <label className="block">
        <span className="text-sm font-medium text-slate-700 dark:text-zinc-200">Correo</span>
        <input
          value={values.email}
          onChange={(event) => onFieldChange('email', event.target.value)}
          className="mt-1 h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
        />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-slate-700 dark:text-zinc-200">Contraseña</span>
        <input
          type="password"
          value={values.password}
          onChange={(event) => onFieldChange('password', event.target.value)}
          className="mt-1 h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
        />
      </label>
      {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      <button
        disabled={isSubmitting}
        className="h-10 w-full rounded-md bg-blue-700 px-4 text-sm font-medium text-white hover:bg-blue-800 disabled:opacity-60"
      >
        {isSubmitting ? 'Validando...' : 'Iniciar sesión'}
      </button>
      <button
        type="button"
        onClick={onEnterDemo}
        className="h-10 w-full rounded-md border border-slate-300 px-4 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
      >
        Entrar al prototipo demo
      </button>
    </form>
  )
}
