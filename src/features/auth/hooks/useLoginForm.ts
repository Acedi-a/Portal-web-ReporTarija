import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../services/authService'
import { loginSchema, type LoginFormValues } from '../validations/loginSchema'

const initialValues: LoginFormValues = {
  email: 'admin@reportatarija.bo',
  password: '',
}

export function useLoginForm() {
  const navigate = useNavigate()
  const [values, setValues] = useState<LoginFormValues>(initialValues)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function updateField(name: keyof LoginFormValues, value: string) {
    setValues((current) => ({ ...current, [name]: value }))
  }

  async function submit() {
    setError('')
    const parsed = loginSchema.safeParse(values)

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Revisa los datos ingresados.')
      return
    }

    setIsSubmitting(true)
    try {
      await login(parsed.data)
      navigate('/dashboard')
    } catch {
      setError('No se pudo iniciar sesión. Para el prototipo puedes entrar al panel con el acceso demo.')
    } finally {
      setIsSubmitting(false)
    }
  }

  function enterDemo() {
    localStorage.setItem('reportatarija-demo-session', 'true')
    navigate('/dashboard')
  }

  return {
    values,
    error,
    isSubmitting,
    updateField,
    submit,
    enterDemo,
  }
}
