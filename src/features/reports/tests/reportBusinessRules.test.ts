import { describe, expect, test } from 'vitest'
import { countReportsByStatus } from '../utils/reportMetrics'
import { isReportOverdue } from '../utils/reportDates'
import type { Report, ReportStatus } from '../types/report'

function createReport(status: ReportStatus, createdAt = '2026-05-01T00:00:00.000Z'): Report {
  return {
    id: `${status}-${createdAt}`,
    title: 'Reporte demo',
    description: 'Descripcion demo',
    status,
    priority: 'MEDIA',
    latitude: null,
    longitude: null,
    address: null,
    neighborhood: null,
    created_at: createdAt,
    updated_at: createdAt,
    resolved_at: null,
  }
}

describe('report business rules', () => {
  test('cuenta reportes por estado para el dashboard', () => {
    const reports = [
      createReport('PENDIENTE'),
      createReport('PENDIENTE'),
      createReport('EN_PROCESO'),
      createReport('RESUELTO'),
    ]

    const metrics = countReportsByStatus(reports)

    expect(metrics).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ status: 'PENDIENTE', value: 2 }),
        expect.objectContaining({ status: 'EN_PROCESO', value: 1 }),
        expect.objectContaining({ status: 'RESUELTO', value: 1 }),
        expect.objectContaining({ status: 'RECHAZADO', value: 0 }),
      ]),
    )
  })

  test('marca como vencido un reporte pendiente con 15 dias o mas', () => {
    const report = createReport('PENDIENTE', '2026-05-01T00:00:00.000Z')
    const now = new Date('2026-05-16T00:00:00.000Z')

    expect(isReportOverdue(report, now)).toBe(true)
  })

  test('no marca como vencido un reporte resuelto aunque tenga 15 dias o mas', () => {
    const report = createReport('RESUELTO', '2026-05-01T00:00:00.000Z')
    const now = new Date('2026-05-16T00:00:00.000Z')

    expect(isReportOverdue(report, now)).toBe(false)
  })
})
