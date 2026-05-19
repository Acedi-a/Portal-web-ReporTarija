/*
 * Copia documental del reportService antes de refactorizar.
 * No debe usarse en pantallas nuevas. Sirve para comparar "antes/despues".
 *
 * Bad smells presentes:
 * - Servicio con demasiadas responsabilidades.
 * - Reportes, categorias, areas, funcionarios, evidencias, tracking y notificaciones en un solo archivo.
 * - Mayor acoplamiento entre features.
 */

import { insforge } from '../../../lib/insforge'
import type { Evidence, Report, ReportStatus, StaffUser, TrackingEntry } from '../types/report'

type ReportFilters = {
  search?: string
  status?: string
  category?: string
}

function assertNoErrorBadSmell(error: unknown) {
  if (error) {
    throw error
  }
}

export async function getReportsBadSmell(filters: ReportFilters = {}) {
  let query = insforge.database
    .from('reports')
    .select('*, categories(id,name,code), areas:assigned_area_id(id,name,code), assigned_user:assigned_to(id,full_name,email,role,is_active), citizen:citizen_id(id,full_name,email,role,is_active)')
    .order('created_at', { ascending: false })

  if (filters.status) {
    query = query.eq('status', filters.status)
  }

  if (filters.category) {
    query = query.eq('category_id', Number(filters.category))
  }

  const { data, error } = await query
  assertNoErrorBadSmell(error)

  const reports = (data ?? []) as Report[]
  const search = filters.search?.trim().toLowerCase()

  if (!search) {
    return reports
  }

  return reports.filter((report) =>
    [report.title, report.description, report.address, report.neighborhood, report.categories?.name]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(search)),
  )
}

export async function getReportByIdBadSmell(id: string) {
  const { data, error } = await insforge.database
    .from('reports')
    .select('*, categories(id,name,code), areas:assigned_area_id(id,name,code), assigned_user:assigned_to(id,full_name,email,role,is_active), citizen:citizen_id(id,full_name,email,role,is_active)')
    .eq('id', id)
    .maybeSingle()

  assertNoErrorBadSmell(error)
  return data as Report | null
}

export async function getCategoriesBadSmell() {
  const { data, error } = await insforge.database.from('categories').select('id,name,code').order('name')
  assertNoErrorBadSmell(error)
  return data ?? []
}

export async function getAreasBadSmell() {
  const { data, error } = await insforge.database.from('areas').select('id,name,code').order('name')
  assertNoErrorBadSmell(error)
  return data ?? []
}

export async function getStaffBadSmell() {
  const { data, error } = await insforge.database
    .from('users')
    .select('*, areas:area_id(id,name,code)')
    .neq('role', 'CITIZEN')
    .order('full_name')

  assertNoErrorBadSmell(error)
  return (data ?? []) as StaffUser[]
}

export async function getEvidencesByReportIdBadSmell(reportId: string) {
  const { data, error } = await insforge.database.from('evidences').select('*').eq('report_id', reportId)
  assertNoErrorBadSmell(error)
  return (data ?? []) as Evidence[]
}

export async function getAllEvidencesBadSmell() {
  const { data, error } = await insforge.database.from('evidences').select('*')
  assertNoErrorBadSmell(error)
  return (data ?? []) as Evidence[]
}

export async function getTrackingByReportIdBadSmell(reportId: string) {
  const { data, error } = await insforge.database
    .from('tracking')
    .select('*, users:changed_by(id,full_name,email,role,is_active)')
    .eq('report_id', reportId)
    .order('created_at', { ascending: false })

  assertNoErrorBadSmell(error)
  return (data ?? []) as TrackingEntry[]
}

export async function updateReportStatusBadSmell(report: Report, newStatus: ReportStatus, comment: string) {
  const { error: updateError } = await insforge.database
    .from('reports')
    .update({
      status: newStatus,
      updated_at: new Date().toISOString(),
      resolved_at: newStatus === 'RESUELTO' ? new Date().toISOString() : report.resolved_at,
    })
    .eq('id', report.id)

  assertNoErrorBadSmell(updateError)

  const { error: trackingError } = await insforge.database.from('tracking').insert({
    report_id: report.id,
    previous_status: report.status,
    new_status: newStatus,
    comment: comment || 'Cambio de estado desde el portal municipal.',
  })

  assertNoErrorBadSmell(trackingError)

  await insforge.database.from('notifications').insert({
    report_id: report.id,
    title: 'Reporte actualizado',
    message: `El reporte "${report.title}" cambio a ${newStatus}.`,
    type: newStatus === 'RESUELTO' ? 'SUCCESS' : 'INFO',
  })
}

export async function assignResponsibleBadSmell(reportId: string, userId: string, areaId: string) {
  const { error } = await insforge.database
    .from('reports')
    .update({
      assigned_to: userId || null,
      assigned_area_id: areaId ? Number(areaId) : null,
      status: 'ASIGNADO',
      updated_at: new Date().toISOString(),
    })
    .eq('id', reportId)

  assertNoErrorBadSmell(error)
}

export async function getNotificationsBadSmell() {
  const { data, error } = await insforge.database
    .from('notifications')
    .select('*, reports(id,title,status)')
    .order('created_at', { ascending: false })
    .limit(20)

  assertNoErrorBadSmell(error)
  return data ?? []
}
