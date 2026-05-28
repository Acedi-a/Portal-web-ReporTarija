import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { StaffUser } from '../../reports/types/report'
import { PageHeader } from '../../../shared/components/ui/PageHeader'
import { StaffForm, type StaffFormValue } from '../components/StaffForm'
import { StaffTable } from '../components/StaffTable'
import { createStaffAccess, getAreas, getStaff, toggleStaffStatus, updateStaff, type StaffPayload } from '../services/staffService'

const emptyStaffForm: StaffFormValue = {
  full_name: '',
  email: '',
  password: '',
  role: 'ADMIN',
  area_id: null,
  is_active: true,
}

export function StaffPage() {
  const queryClient = useQueryClient()
  const [form, setForm] = useState<StaffFormValue>(emptyStaffForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [error, setError] = useState('')
  const { data: staff = [] } = useQuery({ queryKey: ['staff'], queryFn: getStaff })
  const { data: areas = [] } = useQuery({ queryKey: ['areas'], queryFn: getAreas })

  const refresh = () => queryClient.invalidateQueries({ queryKey: ['staff'] })
  const createMutation = useMutation({ mutationFn: createStaffAccess, onSuccess: refresh })
  const updateMutation = useMutation({
    mutationFn: (input: { id: string; payload: StaffPayload }) => updateStaff(input.id, input.payload),
    onSuccess: refresh,
  })
  const toggleMutation = useMutation({ mutationFn: toggleStaffStatus, onSuccess: refresh })

  function resetForm() {
    setForm(emptyStaffForm)
    setEditingId(null)
    setError('')
  }

  function handleEdit(user: StaffUser) {
    setEditingId(user.id)
    setError('')
    setForm({
      full_name: user.full_name,
      email: user.email,
      password: '',
      role: user.role === 'ADMIN' ? 'ADMIN' : 'FUNCIONARIO',
      area_id: user.area_id,
      is_active: user.is_active,
    })
  }

  async function handleSubmit() {
    setError('')

    if (!form.full_name.trim() || !form.email.includes('@')) {
      setError('Ingresa nombre y correo válido.')
      return
    }

    if (!editingId && form.password.trim().length < 8) {
      setError('La contraseña inicial debe tener al menos 8 caracteres.')
      return
    }

    try {
      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, payload: toStaffPayload(form) })
      } else {
        await createMutation.mutateAsync(form)
      }
      resetForm()
    } catch {
      setError('No se pudo guardar el acceso. Verifica que el correo no esté repetido y que InsForge Auth esté habilitado.')
    }
  }

  return (
    <div className="space-y-5">
      <PageHeader title="Accesos administrativos" description="Crea cuentas para otras personas que necesiten entrar al panel municipal." />

      {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <StaffForm
        value={form}
        areas={areas}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        isEditing={Boolean(editingId)}
        submitLabel={editingId ? 'Guardar cambios' : 'Crear acceso'}
        onChange={setForm}
        onSubmit={handleSubmit}
        onCancel={editingId ? resetForm : undefined}
      />

      <StaffTable
        staff={staff}
        onEdit={handleEdit}
        onToggleStatus={(user) => toggleMutation.mutate(user)}
      />
    </div>
  )
}

function toStaffPayload(value: StaffFormValue): StaffPayload {
  return {
    full_name: value.full_name,
    email: value.email,
    role: value.role,
    area_id: value.area_id,
    is_active: value.is_active,
  }
}
