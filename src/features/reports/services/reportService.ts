import { insforge } from '../../../lib/insforge'
import { assertNoError } from '../../../lib/insforgeErrors'
import { createReportAssignedNotification, createReportUpdatedNotification } from '../../notifications/services/notificationService'
import { createTrackingEntry } from '../../tracking/services/trackingService'
import type { Report, ReportStatus } from '../types/report'

type ReportFilters = {
  search?: string
  status?: string
  category?: string
  priority?: string
  area?: string
  responsible?: string
  fromDate?: string
  toDate?: string
}

const reportSelect =
  '*, categories(id,name,code), areas:assigned_area_id(id,name,code), assigned_user:assigned_to(id,full_name,email,role,is_active), citizen:citizen_id(id,full_name,email,role,is_active)'

export async function getReports(filters: ReportFilters = {}) {
  let query = insforge.database
    .from('reports')
    .select(reportSelect)
    .order('created_at', { ascending: false })

  if (filters.status) {
    query = query.eq('status', filters.status)
  }

  if (filters.category) {
    query = query.eq('category_id', filters.category)
  }

  if (filters.priority) {
    query = query.eq('priority', filters.priority)
  }

  if (filters.area) {
    query = query.eq('assigned_area_id', filters.area)
  }

  if (filters.responsible) {
    query = query.eq('assigned_to', filters.responsible)
  }

  if (filters.fromDate) {
    query = query.gte('created_at', filters.fromDate)
  }

  if (filters.toDate) {
    query = query.lte('created_at', `${filters.toDate}T23:59:59`)
  }

  const { data, error } = await query
  assertNoError(error)

  const reports = (data ?? []) as Report[]
  const search = filters.search?.trim().toLowerCase()

  if (!search) {
    return reports
  }

  return reports.filter((report) => reportMatchesSearch(report, search))
}

export async function getReportById(id: string) {
  const { data, error } = await insforge.database
    .from('reports')
    .select(reportSelect)
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

export async function assignResponsible(report: Report, userId: string, areaId: string) {
  const { error } = await insforge.database
    .from('reports')
    .update({
      assigned_to: userId || null,
      assigned_area_id: areaId || null,
      status: 'ASIGNADO',
      updated_at: new Date().toISOString(),
    })
    .eq('id', report.id)

  assertNoError(error)

  await createTrackingEntry({
    reportId: report.id,
    previousStatus: report.status,
    newStatus: 'ASIGNADO',
    comment: 'Reporte asignado desde el portal municipal.',
  })

  await createReportAssignedNotification({
    reportId: report.id,
    reportTitle: report.title,
  })
}

function reportMatchesSearch(report: Report, search: string) {
  return [report.title, report.description, report.address, report.neighborhood, report.categories?.name]
    .filter(Boolean)
    .some((value) => String(value).toLowerCase().includes(search))
}
