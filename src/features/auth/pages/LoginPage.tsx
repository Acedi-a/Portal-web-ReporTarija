import { LoginForm } from '../components/LoginForm'
import { useLoginForm } from '../hooks/useLoginForm'
import { PageHeader } from '../../../shared/components/ui/PageHeader'
import { Panel } from '../../../shared/components/ui/Panel'

export function LoginPage() {
  const loginForm = useLoginForm()

  return (
    <main className="grid min-h-screen place-items-center bg-slate-100 px-4 dark:bg-zinc-950">
      <Panel className="w-full max-w-md p-6 shadow-sm">
        <div className="mb-6">
          <PageHeader eyebrow="Panel ReportaTarija" title="Inicio de sesión" description="Acceso para funcionarios municipales." />
        </div>
        <LoginForm
          values={loginForm.values}
          error={loginForm.error}
          isSubmitting={loginForm.isSubmitting}
          onFieldChange={loginForm.updateField}
          onSubmit={loginForm.submit}
          onEnterDemo={loginForm.enterDemo}
        />
      </Panel>
    </main>
  )
}
