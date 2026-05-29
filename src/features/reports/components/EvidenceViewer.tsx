import { useRef } from 'react'
import { ImagePlus } from 'lucide-react'
import { Button } from '../../../shared/components/ui/Button'
import { Panel } from '../../../shared/components/ui/Panel'
import type { Evidence } from '../types/report'

type EvidenceViewerProps = {
  evidences: Evidence[]
  isUploading: boolean
  onUpload: (file: File) => void
}

export function EvidenceViewer({ evidences, isUploading, onUpload }: EvidenceViewerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  return (
    <Panel className="shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-blue-700 dark:text-zinc-400">Archivos</p>
          <h2 className="mt-1 font-semibold text-slate-950 dark:text-zinc-50">Evidencias</h2>
        </div>
        <Button variant="secondary" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
          <ImagePlus className="h-4 w-4" />
          {isUploading ? 'Subiendo...' : 'Subir evidencia'}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0]
            if (file) {
              onUpload(file)
              event.target.value = ''
            }
          }}
        />
      </div>
      {evidences.length === 0 ? (
        <div className="mt-4 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-400">
          No hay evidencias cargadas para este reporte.
        </div>
      ) : (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {evidences.map((evidence) => (
            <img key={evidence.id} src={evidence.file_url} alt={evidence.file_name ?? 'Evidencia'} className="h-44 w-full rounded-md object-cover shadow-sm" />
          ))}
        </div>
      )}
    </Panel>
  )
}
