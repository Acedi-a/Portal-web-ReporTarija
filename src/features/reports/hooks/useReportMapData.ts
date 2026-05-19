import { useMemo } from 'react'
import type { Evidence, Report } from '../types/report'

export type ClusterPointProperties = {
  id: string
  title: string
  status: string
  category: string
  address: string
  image: string
}

export function useReportMapData(reports: Report[], evidences: Evidence[]) {
  const evidenceByReport = useMemo(() => {
    return evidences.reduce<Record<string, Evidence>>((acc, evidence) => {
      acc[evidence.report_id] = evidence
      return acc
    }, {})
  }, [evidences])

  const mappedReports = useMemo(() => reports.filter(hasCoordinates), [reports])

  const geoJsonData = useMemo(() => {
    return {
      type: 'FeatureCollection',
      features: mappedReports.map((report) => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [Number(report.longitude), Number(report.latitude)],
        },
        properties: {
          id: report.id,
          title: report.title,
          status: report.status,
          category: report.categories?.name ?? 'Sin categoría',
          address: report.address ?? report.neighborhood ?? 'Sin dirección',
          image: evidenceByReport[report.id]?.file_url ?? '',
        },
      })),
    } as GeoJSON.FeatureCollection<GeoJSON.Point, ClusterPointProperties>
  }, [evidenceByReport, mappedReports])

  return {
    evidenceByReport,
    mappedReports,
    geoJsonData,
  }
}

function hasCoordinates(report: Report) {
  return report.latitude !== null && report.longitude !== null
}
