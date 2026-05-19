import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, MapPin } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { assignResponsible, getReportById, updateReportStatus } from '../services/reportService'
import { getEvidencesByReportId } from '../services/evidenceService'
import { getAreas, getStaff } from '../../staff/services/staffService'
import { getTrackingByReportId } from '../../tracking/services/trackingService'
import type { ReportStatus } from '../types/report'
import { StatusBadge } from '../../../shared/components/ui/StatusBadge'
import { formatDate, statusLabels } from '../../../shared/utils/format'

export function ReportDetailPage() {
  const { id = '' } = useParams()
  const queryClient = useQueryClient()
  const [newStatus, setNewStatus] = useState<ReportStatus>('EN_REVISION')
  const [comment, setComment] = useState('')
  const [userId, setUserId] = useState('')
  const [areaId, setAreaId] = useState('')
  const { data: report, isLoading } = useQuery({ queryKey: ['report', id], queryFn: () => getReportById(id), enabled: Boolean(id) })
  const { data: evidences = [] } = useQuery({ queryKey: ['evidences', id], queryFn: () => getEvidencesByReportId(id), enabled: Boolean(id) })
  const { data: tracking = [] } = useQuery({ queryKey: ['tracking', id], queryFn: () => getTrackingByReportId(id), enabled: Boolean(id) })
  const { data: staff = [] } = useQuery({ queryKey: ['staff'], queryFn: getStaff })
  const { data: areas = [] } = useQuery({ queryKey: ['areas'], queryFn: getAreas })

  const refresh = async () => {
    await queryClient.invalidateQueries({ queryKey: ['report', id] })
    await queryClient.invalidateQueries({ queryKey: ['tracking', id] })
    await queryClient.invalidateQueries({ queryKey: ['reports'] })
  }

  const statusMutation = useMutation({
    mutationFn: async () => {
      if (!report) return
      await updateReportStatus(report, newStatus, comment)
    },
    onSuccess: refresh,
  })

  const assignmentMutation = useMutation({
    mutationFn: () => assignResponsible(id, userId, areaId),
    onSuccess: refresh,
  })

  if (isLoading) {
    return <div className="text-sm text-slate-500 dark:text-zinc-400">Cargando reporte...</div>
  }

  if (!report) {
    return <div className="text-sm text-slate-500 dark:text-zinc-400">Reporte no encontrado.</div>
  }

  return (
    <div className="space-y-5">
      <Link to="/reports" className="inline-flex items-center gap-2 text-sm font-medium text-blue-700 dark:text-zinc-300">
        <ArrowLeft className="h-4 w-4" />
        Volver a reportes
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-950 dark:text-zinc-50">{report.title}</h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400">{report.categories?.name} · {formatDate(report.created_at)}</p>
        </div>
        <StatusBadge status={report.status} />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <section className="space-y-4 rounded-lg border border-slate-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="font-semibold text-slate-950 dark:text-zinc-50">Detalle del reporte</h2>
          <p className="text-sm leading-6 text-slate-600 dark:text-zinc-300">{report.description}</p>
          <div className="grid gap-3 text-sm md:grid-cols-2">
            <Info label="Ciudadano" value={report.citizen?.full_name ?? 'Ciudadano no identificado'} />
            <Info label="Prioridad" value={report.priority} />
            <Info label="Área" value={report.areas?.name ?? 'Sin área'} />
            <Info label="Responsable" value={report.assigned_user?.full_name ?? 'Sin asignar'} />
            <Info label="Dirección" value={report.address ?? 'Sin dirección'} />
            <Info label="Zona" value={report.neighborhood ?? 'Sin zona'} />
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-zinc-800 dark:bg-zinc-950">
            <div className="flex items-center gap-2 font-medium text-slate-900 dark:text-zinc-50">
              <MapPin className="h-4 w-4 text-blue-700 dark:text-zinc-300" />
              Ubicación
            </div>
            <p className="mt-2 text-sm text-slate-600 dark:text-zinc-300">
              Latitud {report.latitude ?? 'N/D'}, longitud {report.longitude ?? 'N/D'}
            </p>
          </div>
        </section>

        <section className="space-y-4 rounded-lg border border-slate-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="font-semibold text-slate-950 dark:text-zinc-50">Acciones</h2>
          <div className="space-y-3">
            <select value={newStatus} onChange={(event) => setNewStatus(event.target.value as ReportStatus)} className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50">
              {Object.entries(statusLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            <textarea value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Comentario de seguimiento" className="min-h-24 w-full rounded-md border border-slate-200 bg-white p-3 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50" />
            <button onClick={() => statusMutation.mutate()} className="h-10 w-full rounded-md bg-blue-700 px-4 text-sm font-medium text-white hover:bg-blue-800">
              Cambiar estado
            </button>
          </div>
          <div className="border-t border-slate-100 pt-4 dark:border-zinc-800">
            <div className="grid gap-3">
              <select value={areaId} onChange={(event) => setAreaId(event.target.value)} className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50">
                <option value="">Seleccionar área</option>
                {areas.map((area: { id: number; name: string }) => <option key={area.id} value={area.id}>{area.name}</option>)}
              </select>
              <select value={userId} onChange={(event) => setUserId(event.target.value)} className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50">
                <option value="">Seleccionar responsable</option>
                {staff.map((user) => <option key={user.id} value={user.id}>{user.full_name}</option>)}
              </select>
              <button onClick={() => assignmentMutation.mutate()} className="h-10 rounded-md border border-slate-300 px-4 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800">
                Asignar responsable
              </button>
            </div>
          </div>
        </section>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-lg border border-slate-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="font-semibold text-slate-950 dark:text-zinc-50">Evidencias</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {evidences.map((evidence) => (
              <img key={evidence.id} src={evidence.file_url} alt={evidence.file_name ?? 'Evidencia'} className="h-44 w-full rounded-md object-cover" />
            ))}
          </div>
        </section>
        <section className="rounded-lg border border-slate-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="font-semibold text-slate-950 dark:text-zinc-50">Historial de seguimiento</h2>
          <div className="mt-4 space-y-3">
            {tracking.map((entry) => (
              <div key={entry.id} className="rounded-md border border-slate-100 p-3 dark:border-zinc-800">
                <div className="flex items-center justify-between gap-3">
                  <StatusBadge status={entry.new_status} />
                  <span className="text-xs text-slate-500 dark:text-zinc-400">{formatDate(entry.created_at)}</span>
                </div>
                <p className="mt-2 text-sm text-slate-600 dark:text-zinc-300">{entry.comment ?? 'Sin comentario'}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase text-slate-400 dark:text-zinc-500">{label}</p>
      <p className="font-medium text-slate-900 dark:text-zinc-100">{value}</p>
    </div>
  )
}
