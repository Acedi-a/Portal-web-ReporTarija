import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { login } from '../services/authService'
import { startDemoSession } from '../services/authSession'
import { loginSchema, type LoginFormValues } from '../validations/loginSchema'

const defaultLoginValues: LoginFormValues = {
  email: 'admin@reportatarija.bo',
  password: '',
}

export function useLoginForm() {
  const navigate = useNavigate()
  const [values, setValues] = useState<LoginFormValues>(defaultLoginValues)
  const [error, setError] = useState('')
  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: () => navigate('/dashboard'),
    onError: () => {
      setError('No se pudo iniciar sesión. Para el prototipo puedes entrar al panel con el acceso demo.')
    },
  })

  function updateField(name: keyof LoginFormValues, value: string) {
    setValues((current) => ({ ...current, [name]: value }))
    setError('')
  }

  async function submit() {
    setError('')
    const parsed = loginSchema.safeParse(values)

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Revisa los datos ingresados.')
      return
    }

    loginMutation.mutate(parsed.data)
  }

  function enterDemo() {
    startDemoSession()
    navigate('/dashboard')
  }

  return {
    values,
    error,
    isSubmitting: loginMutation.isPending,
    updateField,
    submit,
    enterDemo,
  }
}
