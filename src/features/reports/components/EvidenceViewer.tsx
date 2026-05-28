import { useRef } from 'react'
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
    <Panel>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-semibold text-slate-950 dark:text-zinc-50">Evidencias</h2>
        <Button variant="secondary" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
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
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {evidences.map((evidence) => (
          <img key={evidence.id} src={evidence.file_url} alt={evidence.file_name ?? 'Evidencia'} className="h-44 w-full rounded-md object-cover" />
        ))}
      </div>
    </Panel>
  )
}
