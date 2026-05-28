import type { ReportStatus } from '../types/report'

export function validateStatusChange(status: ReportStatus, comment: string) {
  if (status === 'RECHAZADO' && !comment.trim()) {
    return 'Para rechazar un reporte debes registrar un comentario.'
  }

  return ''
}

export function validateAssignment(userId: string, areaId: string) {
  if (!userId && !areaId) {
    return 'Selecciona un responsable o un area municipal.'
  }

  return ''
}
