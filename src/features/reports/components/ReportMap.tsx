import { Layers3, MapPin } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Map, MapClusterLayer, MapControls, MapMarker, MapPopup, MarkerContent, MarkerPopup, MarkerTooltip } from '../../../components/ui/map'
import type { ClusterPointProperties } from '../hooks/useReportMapData'
import type { Evidence, Report } from '../types/report'
import { REPORT_MAP_CONFIG, priorityMarkerClasses } from '../constants/reportOptions'
import { ClusterPopup, ReportMapPopup } from './ReportMapPopup'

export type MapMode = 'markers' | 'clusters'

type ReportMapProps = {
  mappedReports: Report[]
  geoJsonData: GeoJSON.FeatureCollection<GeoJSON.Point, ClusterPointProperties>
  evidenceByReport: Record<string, Evidence>
  selectedReport?: Report | null
  onSelectReport?: (report: Report) => void
}

export function ReportMap({ mappedReports, geoJsonData, evidenceByReport, selectedReport, onSelectReport }: ReportMapProps) {
  const [mapMode, setMapMode] = useState<MapMode>('markers')
  const [selectedPoint, setSelectedPoint] = useState<{
    coordinates: [number, number]
    properties: ClusterPointProperties
  } | null>(null)

  const selectedCoordinates = useMemo(() => {
    if (!selectedReport?.latitude || !selectedReport.longitude) {
      return null
    }

    return [Number(selectedReport.longitude), Number(selectedReport.latitude)] as [number, number]
  }, [selectedReport])
  const mapCenter = selectedCoordinates ?? REPORT_MAP_CONFIG.defaultCenter
  const mapZoom = selectedCoordinates ? REPORT_MAP_CONFIG.selectedZoom : REPORT_MAP_CONFIG.defaultZoom

  return (
    <div className="relative min-h-[560px] bg-slate-200 dark:bg-zinc-950">
      <div className="absolute right-4 top-4 z-10 inline-flex rounded-lg border border-slate-200 bg-white p-1 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
        <MapModeButton active={mapMode === 'markers'} onClick={() => setMapMode('markers')} icon="marker" label="Markers" />
        <MapModeButton active={mapMode === 'clusters'} onClick={() => setMapMode('clusters')} icon="cluster" label="Clusters" />
      </div>

      <Map
        key={selectedReport?.id ?? 'tarija'}
        center={mapCenter}
        zoom={mapZoom}
        className="h-full min-h-[560px] w-full"
        fadeDuration={0}
      >
        {mapMode === 'markers' ? (
          mappedReports.map((report) => (
            <MapMarker
              key={report.id}
              longitude={Number(report.longitude)}
              latitude={Number(report.latitude)}
              onClick={() => onSelectReport?.(report)}
            >
              <MarkerContent>
                <div
                  className={`group relative grid size-9 place-items-center rounded-full border-2 border-white text-white shadow-lg transition-transform hover:scale-110 dark:border-zinc-950 ${priorityMarkerClasses[report.priority]} ${
                    selectedReport?.id === report.id ? 'ring-4 ring-blue-200' : ''
                  }`}
                >
                  <MapPin className="h-4 w-4 fill-current" />
                  <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-white ring-2 ring-slate-300 dark:ring-slate-950" />
                </div>
              </MarkerContent>
              <MarkerTooltip>{report.title}</MarkerTooltip>
              <MarkerPopup className="w-72 p-0">
                <ReportMapPopup report={report} imageUrl={evidenceByReport[report.id]?.file_url} />
              </MarkerPopup>
            </MapMarker>
          ))
        ) : (
          <MapClusterLayer<ClusterPointProperties>
            data={geoJsonData}
            clusterRadius={REPORT_MAP_CONFIG.clusterRadius}
            clusterMaxZoom={REPORT_MAP_CONFIG.clusterMaxZoom}
            clusterColors={REPORT_MAP_CONFIG.clusterColors}
            clusterThresholds={REPORT_MAP_CONFIG.clusterThresholds}
            pointColor={REPORT_MAP_CONFIG.pointColor}
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
            <ClusterPopup point={selectedPoint.properties} />
          </MapPopup>
        )}
        <MapControls position="top-right" className="top-20" />
      </Map>

      <div className="pointer-events-none absolute left-4 top-4 rounded-lg border border-white/70 bg-white/90 px-4 py-3 shadow-lg backdrop-blur dark:border-zinc-700 dark:bg-zinc-900/90">
        <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-zinc-400">Mapa operativo</p>
        <p className="text-sm font-semibold text-slate-950 dark:text-slate-50">Tarija · reportes urbanos</p>
      </div>
    </div>
  )
}

function MapModeButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean
  onClick: () => void
  icon: 'marker' | 'cluster'
  label: string
}) {
  const Icon = icon === 'marker' ? MapPin : Layers3

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium ${
        active
          ? 'bg-blue-700 text-white dark:bg-zinc-100 dark:text-zinc-950'
          : 'text-slate-600 hover:bg-slate-50 dark:text-zinc-300 dark:hover:bg-zinc-800'
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  )
}
