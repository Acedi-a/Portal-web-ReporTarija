import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getAreas, getStaff } from '../../staff/services/staffService'
import { getAllEvidences } from '../services/evidenceService'
import { getCategories } from '../services/categoryService'
import { getReports } from '../services/reportService'
import { useReportMapData } from './useReportMapData'
import type { ReportFiltersState } from './useReportFilters'
import type { Area, Category, Evidence, Report, StaffUser } from '../types/report'

const emptyReports: Report[] = []
const emptyEvidences: Evidence[] = []
const emptyCategories: Category[] = []
const emptyAreas: Area[] = []
const emptyStaff: StaffUser[] = []

export function useReportsPageData(filters: ReportFiltersState) {
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null)

  const reportsQuery = useQuery({
    queryKey: ['reports', filters],
    queryFn: () => getReports(filters),
  })
  const categoriesQuery = useQuery({ queryKey: ['categories'], queryFn: getCategories })
  const areasQuery = useQuery({ queryKey: ['areas'], queryFn: getAreas })
  const staffQuery = useQuery({ queryKey: ['staff'], queryFn: getStaff })
  const evidencesQuery = useQuery({ queryKey: ['evidences'], queryFn: getAllEvidences })

  const reports = reportsQuery.data ?? emptyReports
  const evidences = evidencesQuery.data ?? emptyEvidences
  const reportsVisibleOnMap = useMemo(
    () => reports.filter((report) => report.status !== 'RESUELTO'),
    [reports],
  )
  const mapData = useReportMapData(reportsVisibleOnMap, evidences)
  const selectedReport = reports.find((report) => report.id === selectedReportId) ?? null
  const selectedReportOnMap = selectedReport?.status === 'RESUELTO' ? null : selectedReport

  function selectReport(report: Report) {
    setSelectedReportId(report.id)
  }

  return {
    reports,
    isLoadingReports: reportsQuery.isLoading,
    categories: categoriesQuery.data ?? emptyCategories,
    areas: areasQuery.data ?? emptyAreas,
    staff: staffQuery.data ?? emptyStaff,
    selectedReport,
    selectedReportId,
    selectedReportOnMap,
    selectReport,
    clearSelectedReport: () => setSelectedReportId(null),
    ...mapData,
  }
}
