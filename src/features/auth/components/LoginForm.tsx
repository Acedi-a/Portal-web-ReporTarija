import type { FormEvent } from 'react'
import { Button } from '../../../shared/components/ui/Button'
import { TextInput } from '../../../shared/components/ui/FormControls'
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
      <TextInput label="Correo" value={values.email} onChange={(event) => onFieldChange('email', event.target.value)} />
      <TextInput
        label="Contraseña"
        type="password"
        value={values.password}
        onChange={(event) => onFieldChange('password', event.target.value)}
      />
      {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Validando...' : 'Iniciar sesión'}
      </Button>
      <Button variant="secondary" onClick={onEnterDemo} className="w-full">
        Entrar al prototipo demo
      </Button>
    </form>
  )
}
