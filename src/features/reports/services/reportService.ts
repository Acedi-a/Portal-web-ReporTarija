import { insforge } from '../../../lib/insforge'
import { assertNoError } from '../../../lib/insforgeErrors'
import { createReportAssignedNotification, createReportUpdatedNotification } from '../../notifications/services/notificationService'
import { createTrackingEntry } from '../tracking/services/trackingService'
import {
  assignResponsibleDtoSchema,
  updateReportStatusDtoSchema,
  type AssignResponsibleDto,
  type ReportFiltersDto,
  type UpdateReportStatusDto,
} from '../dtos/reportActionDtos'
import type { Report } from '../types/report'

export type ReportFilters = ReportFiltersDto

const reportSelect =
  '*, categories(id,name,code), areas:assigned_area_id(id,name,code), assigned_user:assigned_to(id,full_name,email,role,is_active), citizen:citizen_id(id,full_name,email,role,is_active)'

const reportFilterColumns: Array<[keyof ReportFilters, string]> = [
  ['status', 'status'],
  ['category', 'category_id'],
  ['priority', 'priority'],
  ['area', 'assigned_area_id'],
  ['responsible', 'assigned_to'],
]

export async function getReports(filters: ReportFilters = {}) {
  let query = insforge.database
    .from('reports')
    .select(reportSelect)
    .order('created_at', { ascending: false })

  query = applyReportFilters(query, filters)

  const { data, error } = await query
  assertNoError(error)

  return filterReportsBySearch((data ?? []) as Report[], filters.search)
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

export async function updateReportStatus(input: UpdateReportStatusDto) {
  const parsed = updateReportStatusDtoSchema.parse(input)
  const { error: updateError } = await insforge.database
    .from('reports')
    .update({
      status: parsed.newStatus,
      updated_at: new Date().toISOString(),
      resolved_at: parsed.newStatus === 'RESUELTO' ? new Date().toISOString() : parsed.resolvedAt,
    })
    .eq('id', parsed.reportId)

  assertNoError(updateError)

  await createTrackingEntry({
    reportId: parsed.reportId,
    previousStatus: parsed.previousStatus,
    newStatus: parsed.newStatus,
    comment: parsed.comment,
  })

  await createReportUpdatedNotification({
    reportId: parsed.reportId,
    reportTitle: parsed.reportTitle,
    newStatus: parsed.newStatus,
  })
}

export async function assignResponsible(input: AssignResponsibleDto) {
  const parsed = assignResponsibleDtoSchema.parse(input)
  const { error } = await insforge.database
    .from('reports')
    .update({
      assigned_to: parsed.userId || null,
      assigned_area_id: parsed.areaId || null,
      status: 'ASIGNADO',
      updated_at: new Date().toISOString(),
    })
    .eq('id', parsed.reportId)

  assertNoError(error)

  await createTrackingEntry({
    reportId: parsed.reportId,
    previousStatus: parsed.previousStatus,
    newStatus: 'ASIGNADO',
    comment: 'Reporte asignado desde el portal municipal.',
  })

  await createReportAssignedNotification({
    reportId: parsed.reportId,
    reportTitle: parsed.reportTitle,
  })
}

function reportMatchesSearch(report: Report, search: string) {
  return [report.title, report.description, report.address, report.neighborhood, report.categories?.name]
    .filter(Boolean)
    .some((value) => String(value).toLowerCase().includes(search))
}

function applyReportFilters<Query>(query: Query, filters: ReportFilters) {
  let filteredQuery = query as Query & {
    eq: (column: string, value: string) => typeof filteredQuery
    gte: (column: string, value: string) => typeof filteredQuery
    lte: (column: string, value: string) => typeof filteredQuery
  }

  reportFilterColumns.forEach(([filterKey, column]) => {
    const value = filters[filterKey]

    if (value) {
      filteredQuery = filteredQuery.eq(column, value)
    }
  })

  if (filters.fromDate) {
    filteredQuery = filteredQuery.gte('created_at', filters.fromDate)
  }

  if (filters.toDate) {
    filteredQuery = filteredQuery.lte('created_at', `${filters.toDate}T23:59:59`)
  }

  return filteredQuery
}

function filterReportsBySearch(reports: Report[], searchValue?: string) {
  const search = searchValue?.trim().toLowerCase()
  return search ? reports.filter((report) => reportMatchesSearch(report, search)) : reports
}
