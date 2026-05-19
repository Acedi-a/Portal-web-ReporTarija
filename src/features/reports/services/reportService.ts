import { insforge } from '../../../lib/insforge'
import { assertNoError } from '../../../lib/insforgeErrors'
import { createReportUpdatedNotification } from '../../notifications/services/notificationService'
import { createTrackingEntry } from '../../tracking/services/trackingService'
import type { Report, ReportStatus } from '../types/report'

type ReportFilters = {
  search?: string
  status?: string
  category?: string
}

export async function getReports(filters: ReportFilters = {}) {
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
  assertNoError(error)

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

export async function getReportById(id: string) {
  const { data, error } = await insforge.database
    .from('reports')
    .select('*, categories(id,name,code), areas:assigned_area_id(id,name,code), assigned_user:assigned_to(id,full_name,email,role,is_active), citizen:citizen_id(id,full_name,email,role,is_active)')
    .eq('id', id)
    .maybeSingle()

  assertNoError(error)
  return data as Report | null
}

export async function updateReportStatus(report: Report, newStatus: ReportStatus, comment: string) {
  const { error: updateError } = await insforge.database
    .from('reports')
    .update({
      status: newStatus,
      updated_at: new Date().toISOString(),
      resolved_at: newStatus === 'RESUELTO' ? new Date().toISOString() : report.resolved_at,
    })
    .eq('id', report.id)

  assertNoError(updateError)

  await createTrackingEntry({
    reportId: report.id,
    previousStatus: report.status,
    newStatus,
    comment,
  })

  await createReportUpdatedNotification({
    reportId: report.id,
    reportTitle: report.title,
    newStatus,
  })
}

export async function assignResponsible(reportId: string, userId: string, areaId: string) {
  const { error } = await insforge.database
    .from('reports')
    .update({
      assigned_to: userId || null,
      assigned_area_id: areaId ? Number(areaId) : null,
      status: 'ASIGNADO',
      updated_at: new Date().toISOString(),
    })
    .eq('id', reportId)

  assertNoError(error)
}
