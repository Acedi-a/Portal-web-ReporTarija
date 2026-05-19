import { LoginForm } from '../components/LoginForm'
import { useLoginForm } from '../hooks/useLoginForm'

export function LoginPage() {
  const loginForm = useLoginForm()

  return (
    <main className="grid min-h-screen place-items-center bg-slate-100 px-4 dark:bg-zinc-950">
      <section className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-6">
          <p className="text-sm font-medium text-blue-700 dark:text-zinc-400">Panel ReportaTarija</p>
          <h1 className="text-2xl font-semibold text-slate-950 dark:text-zinc-50">Inicio de sesión</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">Acceso para funcionarios municipales.</p>
        </div>
        <LoginForm
          values={loginForm.values}
          error={loginForm.error}
          isSubmitting={loginForm.isSubmitting}
          onFieldChange={loginForm.updateField}
          onSubmit={loginForm.submit}
          onEnterDemo={loginForm.enterDemo}
        />
      </section>
    </main>
  )
}
