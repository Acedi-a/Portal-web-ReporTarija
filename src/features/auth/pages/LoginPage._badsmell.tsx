/*
 * VERSION ORIGINAL PARA COMPARACION DE REFACTORIZACION.
 *
 * Bad smells identificados segun la clasificacion vista en clase:
 *
 * 1. The Bloaters / Los infladores:
 *    LoginPage concentra demasiadas tareas en un solo componente:
 *    estado del formulario, validacion, submit, navegacion, errores y renderizado.
 *
 * 2. The Change Preventers / Preventores de cambio:
 *    Si cambia la validacion o el flujo de login, se debe modificar esta pantalla.
 *    La logica no esta separada en hook, schema o formulario reutilizable.
 *
 * 3. The Couplers / Los acopladores:
 *    La vista esta acoplada directamente al servicio de autenticacion y al router.
 *
 * 4. The Dispensables / Los prescindibles:
 *    La validacion manual con email.includes('@') es una regla fragil que puede
 *    reemplazarse por un schema reutilizable con Zod.
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../services/authService_badsmell'

export function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('admin@reportatarija.bo')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    if (!email.includes('@') || password.length < 6) {
      setError('Ingresa un correo válido y una contraseña de al menos 6 caracteres.')
      return
    }

    setIsSubmitting(true)
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch {
      setError('No se pudo iniciar sesión. Para el prototipo puedes entrar al panel con el acceso demo.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-slate-100 px-4 dark:bg-zinc-950">
      <section className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-6">
          <p className="text-sm font-medium text-blue-700 dark:text-zinc-400">Panel ReportaTarija</p>
          <h1 className="text-2xl font-semibold text-slate-950 dark:text-zinc-50">Inicio de sesión</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">Acceso para funcionarios municipales.</p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-sm font-medium text-slate-700 dark:text-zinc-200">Correo</span>
            <input value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1 h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50" />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700 dark:text-zinc-200">Contraseña</span>
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-1 h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50" />
          </label>
          {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
          <button disabled={isSubmitting} className="h-10 w-full rounded-md bg-blue-700 px-4 text-sm font-medium text-white hover:bg-blue-800 disabled:opacity-60">
            {isSubmitting ? 'Validando...' : 'Iniciar sesión'}
          </button>
          <button type="button" onClick={() => navigate('/dashboard')} className="h-10 w-full rounded-md border border-slate-300 px-4 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800">
            Entrar al prototipo demo
          </button>
        </form>
      </section>
    </main>
  )
}
