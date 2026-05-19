/*
 * Copia documental del ReportsPage antes de refactorizar.
 * No se importa en el router. Sirve para comparar "antes/despues" 
 *
 * Bad smells presentes:
 * - Componente muy grande. (Inflacion)
 * - Mezcla filtros, queries, lista, mapa, markers, clusters y popups. ()
 * - Contiene transformacion GeoJSON dentro del componente visual.
 * - Define componentes auxiliares locales en el mismo archivo. ()
 */

import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Layers3, ListFilter, MapPin, Search } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { getReports } from '../services/reportService'
import { getCategories } from '../services/categoryService'
import { getAllEvidences } from '../services/evidenceService'
import { Map, MapClusterLayer, MapControls, MapMarker, MapPopup, MarkerContent, MarkerPopup, MarkerTooltip } from '../../../components/ui/map'
import type { Evidence, Report } from '../types/report'
import { StatusBadge } from '../../../shared/components/ui/StatusBadge'
import { formatDate, statusLabels } from '../../../shared/utils/format'

type MapMode = 'markers' | 'clusters'

type ClusterPointProperties = {
  id: string
  title: string
  status: string
  category: string
  address: string
  image: string
}

export function ReportsPageBadSmell() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [category, setCategory] = useState('')
  const [mapMode, setMapMode] = useState<MapMode>('markers')
  const [selectedPoint, setSelectedPoint] = useState<{
    coordinates: [number, number]
    properties: ClusterPointProperties
  } | null>(null)

  const filters = useMemo(() => ({ search, status, category }), [search, status, category])
  const { data: reports = [], isLoading } = useQuery({ queryKey: ['reports', filters], queryFn: () => getReports(filters) })
  const { data: categories = [] } = useQuery({ queryKey: ['categories'], queryFn: getCategories })
  const { data: evidences = [] } = useQuery({ queryKey: ['evidences'], queryFn: getAllEvidences })

  const evidenceByReport = useMemo(() => {
    return evidences.reduce<Record<string, Evidence>>((acc, evidence) => {
      acc[evidence.report_id] = evidence
      return acc
    }, {})
  }, [evidences])

  const mappedReports = reports.filter(hasCoordinates)

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
          category: report.categories?.name ?? 'Sin categoria',
          address: report.address ?? report.neighborhood ?? 'Sin direccion',
          image: evidenceByReport[report.id]?.file_url ?? '',
        },
      })),
    } as GeoJSON.FeatureCollection<GeoJSON.Point, ClusterPointProperties>
  }, [evidenceByReport, mappedReports])

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-blue-700 dark:text-zinc-400">Centro de operaciones</p>
          <h1 className="text-2xl font-semibold text-slate-950 dark:text-slate-50">Gestion geografica de reportes</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Visualiza incidencias urbanas por ubicacion y prioriza la atencion municipal.</p>
        </div>
        <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1 dark:border-zinc-800 dark:bg-zinc-900">
          <button
            onClick={() => setMapMode('markers')}
            className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium ${
              mapMode === 'markers' ? 'bg-blue-700 text-white dark:bg-zinc-100 dark:text-zinc-950' : 'text-slate-600 hover:bg-slate-50 dark:text-zinc-300 dark:hover:bg-zinc-800'
            }`}
          >
            <MapPin className="h-4 w-4" />
            Markers
          </button>
          <button
            onClick={() => setMapMode('clusters')}
            className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium ${
              mapMode === 'clusters' ? 'bg-blue-700 text-white dark:bg-zinc-100 dark:text-zinc-950' : 'text-slate-600 hover:bg-slate-50 dark:text-zinc-300 dark:hover:bg-zinc-800'
            }`}
          >
            <Layers3 className="h-4 w-4" />
            Clusters
          </button>
        </div>
      </div>

      <section className="grid min-h-[calc(100vh-12rem)] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 xl:grid-cols-[430px_1fr]">
        <aside className="flex min-h-[560px] flex-col border-r border-slate-200 dark:border-zinc-800">
          <div className="border-b border-slate-200 p-4 dark:border-zinc-800">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-zinc-100">
              <ListFilter className="h-4 w-4 text-blue-700 dark:text-zinc-300" />
              Filtros operativos
            </div>
            <div className="grid gap-3">
              <label className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Buscar por titulo, zona o descripcion"
                  className="h-10 w-full rounded-md border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <select value={status} onChange={(event) => setStatus(event.target.value)} className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100">
                  <option value="">Estados</option>
                  {Object.entries(statusLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
                <select value={category} onChange={(event) => setCategory(event.target.value)} className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100">
                  <option value="">Categorias</option>
                  {categories.map((item: { id: number; name: string }) => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 text-sm dark:border-zinc-800">
            <span className="font-medium text-slate-900 dark:text-zinc-100">{reports.length} reportes</span>
            <span className="text-slate-500 dark:text-zinc-400">{mappedReports.length} con ubicacion</span>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {isLoading ? (
              <div className="rounded-lg border border-slate-200 p-4 text-sm text-slate-500 dark:border-zinc-800 dark:text-zinc-400">Cargando reportes...</div>
            ) : reports.length === 0 ? (
              <div className="rounded-lg border border-slate-200 p-4 text-sm text-slate-500 dark:border-zinc-800 dark:text-zinc-400">No hay reportes con esos filtros.</div>
            ) : (
              reports.map((report) => (
                <ReportListCard key={report.id} report={report} imageUrl={evidenceByReport[report.id]?.file_url} />
              ))
            )}
          </div>
        </aside>

        <div className="relative min-h-[560px] bg-slate-200 dark:bg-zinc-950">
          <Map center={[-64.729, -21.535]} zoom={12.2} className="h-full min-h-[560px] w-full" fadeDuration={0}>
            {mapMode === 'markers' ? (
              mappedReports.map((report) => (
                <MapMarker key={report.id} longitude={Number(report.longitude)} latitude={Number(report.latitude)}>
                  <MarkerContent>
                    <div className="group relative grid size-9 place-items-center rounded-full border-2 border-white bg-blue-700 text-white shadow-lg transition-transform hover:scale-110 dark:border-zinc-950 dark:bg-zinc-100 dark:text-zinc-950">
                      <MapPin className="h-4 w-4 fill-current" />
                      <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-amber-400 ring-2 ring-white dark:ring-slate-950" />
                    </div>
                  </MarkerContent>
                  <MarkerTooltip>{report.title}</MarkerTooltip>
                  <MarkerPopup className="w-72 p-0">
                    <ReportMapPopupLocal report={report} imageUrl={evidenceByReport[report.id]?.file_url} />
                  </MarkerPopup>
                </MapMarker>
              ))
            ) : (
              <MapClusterLayer<ClusterPointProperties>
                data={geoJsonData}
                clusterRadius={52}
                clusterMaxZoom={14}
                clusterColors={['#2563eb', '#0891b2', '#dc2626']}
                clusterThresholds={[3, 6]}
                pointColor="#2563eb"
                onPointClick={(feature, coordinates) => {
                  setSelectedPoint({
                    coordinates,
                    properties: feature.properties,
                  })
                }}
              />
            )}
            {selectedPoint && mapMode === 'clusters' && (
              <MapPopup
                longitude={selectedPoint.coordinates[0]}
                latitude={selectedPoint.coordinates[1]}
                onClose={() => setSelectedPoint(null)}
                closeButton
                className="w-72 p-0"
              >
                <ClusterPopupLocal point={selectedPoint.properties} />
              </MapPopup>
            )}
            <MapControls position="top-right" />
          </Map>
        </div>
      </section>
    </div>
  )
}

function hasCoordinates(report: Report) {
  return report.latitude !== null && report.longitude !== null
}

function ReportListCard({ report, imageUrl }: { report: Report; imageUrl?: string }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-3 transition hover:border-blue-200 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700">
      <div className="flex gap-3">
        {imageUrl ? <img src={imageUrl} alt="" className="h-20 w-24 rounded-md object-cover" /> : null}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h2 className="line-clamp-2 font-medium text-slate-950 dark:text-slate-50">{report.title}</h2>
            <StatusBadge status={report.status} />
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{report.categories?.name} · {formatDate(report.created_at)}</p>
          <p className="mt-1 truncate text-sm text-slate-600 dark:text-slate-300">{report.neighborhood ?? report.address}</p>
          <div className="mt-3 flex items-center justify-between gap-3">
            <span className="text-xs text-slate-500 dark:text-slate-400">{report.assigned_user?.full_name ?? 'Sin asignar'}</span>
            <Link className="text-sm font-medium text-blue-700 hover:text-blue-900 dark:text-zinc-300" to={`/reports/${report.id}`}>
              Ver detalle
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}

function ReportMapPopupLocal({ report, imageUrl }: { report: Report; imageUrl?: string }) {
  return (
    <div className="overflow-hidden rounded-md bg-white dark:bg-zinc-900">
      {imageUrl ? <img src={imageUrl} alt="" className="h-32 w-full object-cover" /> : null}
      <div className="space-y-2 p-3">
        <StatusBadge status={report.status} />
        <div>
          <h3 className="font-semibold leading-tight text-slate-950 dark:text-slate-50">{report.title}</h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{report.categories?.name} · {report.address}</p>
        </div>
        <Link to={`/reports/${report.id}`} className="inline-flex h-9 w-full items-center justify-center rounded-md bg-blue-700 text-sm font-medium text-white hover:bg-blue-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200">
          Abrir reporte
        </Link>
      </div>
    </div>
  )
}

function ClusterPopupLocal({ point }: { point: ClusterPointProperties }) {
  return (
    <div className="overflow-hidden rounded-md bg-white dark:bg-zinc-900">
      {point.image ? <img src={point.image} alt="" className="h-32 w-full object-cover" /> : null}
      <div className="space-y-2 p-3">
        <p className="text-xs font-medium uppercase tracking-wide text-blue-700 dark:text-zinc-400">{point.category}</p>
        <h3 className="font-semibold leading-tight text-slate-950 dark:text-slate-50">{point.title}</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">{point.address}</p>
        <Link to={`/reports/${point.id}`} className="inline-flex h-9 w-full items-center justify-center rounded-md bg-blue-700 text-sm font-medium text-white hover:bg-blue-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200">
          Abrir reporte
        </Link>
      </div>
    </div>
  )
}
