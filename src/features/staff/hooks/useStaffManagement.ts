import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { StaffUser } from '../../reports/types/report'
import {
  createStaffAccess,
  getAreas,
  getStaff,
  toggleStaffStatus,
  updateStaff,
  type StaffPayload,
} from '../services/staffService'
import { createStaffSchema, updateStaffSchema, type StaffFormValue } from '../validations/staffSchema'

const emptyStaffForm: StaffFormValue = {
  full_name: '',
  email: '',
  password: '',
  role: 'ADMIN',
  area_id: null,
  is_active: true,
}

export function useStaffManagement() {
  const queryClient = useQueryClient()
  const [form, setForm] = useState<StaffFormValue>(emptyStaffForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [error, setError] = useState('')
  const staffQuery = useQuery({ queryKey: ['staff'], queryFn: getStaff })
  const areasQuery = useQuery({ queryKey: ['areas'], queryFn: getAreas })

  const refreshStaff = () => queryClient.invalidateQueries({ queryKey: ['staff'] })
  const createMutation = useMutation({ mutationFn: createStaffAccess, onSuccess: refreshStaff })
  const updateMutation = useMutation({
    mutationFn: (input: { id: string; payload: StaffPayload }) => updateStaff(input.id, input.payload),
    onSuccess: refreshStaff,
  })
  const toggleMutation = useMutation({ mutationFn: toggleStaffStatus, onSuccess: refreshStaff })

  function updateForm(value: StaffFormValue) {
    setForm(value)
    setError('')
  }

  function resetForm() {
    setForm(emptyStaffForm)
    setEditingId(null)
    setError('')
  }

  function editStaff(user: StaffUser) {
    setEditingId(user.id)
    setError('')
    setForm({
      full_name: user.full_name,
      email: user.email,
      password: '',
      role: user.role === 'CITIZEN' ? 'FUNCIONARIO' : user.role,
      area_id: user.area_id,
      is_active: user.is_active,
    })
  }

  async function submitForm() {
    setError('')

    if (editingId) {
      await submitUpdate(editingId)
      return
    }

    await submitCreate()
  }

  async function submitCreate() {
    const parsed = createStaffSchema.safeParse(form)

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Revisa los datos del funcionario.')
      return
    }

    try {
      await createMutation.mutateAsync(parsed.data)
      resetForm()
    } catch {
      setError('No se pudo guardar el acceso. Verifica que el correo no esté repetido y que InsForge Auth esté habilitado.')
    }
  }

  async function submitUpdate(id: string) {
    const parsed = updateStaffSchema.safeParse(form)

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Revisa los datos del funcionario.')
      return
    }

    try {
      await updateMutation.mutateAsync({ id, payload: toStaffPayload(form) })
      resetForm()
    } catch {
      setError('No se pudo guardar el acceso. Verifica que el correo no esté repetido y que InsForge Auth esté habilitado.')
    }
  }

  return {
    form,
    error,
    staff: staffQuery.data ?? [],
    areas: areasQuery.data ?? [],
    isLoading: staffQuery.isLoading || areasQuery.isLoading,
    isEditing: Boolean(editingId),
    isSubmitting: createMutation.isPending || updateMutation.isPending,
    updateForm,
    resetForm,
    editStaff,
    submitForm,
    toggleStaffStatus: toggleMutation.mutate,
  }
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
