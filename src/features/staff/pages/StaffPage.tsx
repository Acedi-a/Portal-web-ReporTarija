import { PageHeader } from '../../../shared/components/ui/PageHeader'
import { StaffForm } from '../components/StaffForm'
import { StaffTable } from '../components/StaffTable'
import { useStaffManagement } from '../hooks/useStaffManagement'

export function StaffPage() {
  const staffManagement = useStaffManagement()

  if (staffManagement.isLoading) {
    return <div className="text-sm text-slate-500 dark:text-zinc-400">Cargando accesos...</div>
  }

  return (
    <div className="space-y-5">
      <PageHeader title="Accesos administrativos" description="Crea cuentas para otras personas que necesiten entrar al panel municipal." />

      {staffManagement.error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{staffManagement.error}</p>}

      <StaffForm
        value={staffManagement.form}
        areas={staffManagement.areas}
        isSubmitting={staffManagement.isSubmitting}
        isEditing={staffManagement.isEditing}
        submitLabel={staffManagement.isEditing ? 'Guardar cambios' : 'Crear acceso'}
        onChange={staffManagement.updateForm}
        onSubmit={staffManagement.submitForm}
        onCancel={staffManagement.isEditing ? staffManagement.resetForm : undefined}
      />

      <StaffTable
        staff={staffManagement.staff}
        onEdit={staffManagement.editStaff}
        onToggleStatus={staffManagement.toggleStaffStatus}
      />
    </div>
  )
}
