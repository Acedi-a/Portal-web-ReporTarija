export type ReportStatus =
  | 'PENDIENTE'
  | 'EN_REVISION'
  | 'ASIGNADO'
  | 'EN_PROCESO'
  | 'RESUELTO'
  | 'RECHAZADO'

export type Priority = 'BAJA' | 'MEDIA' | 'ALTA' | 'URGENTE'

export type Area = {
  id: string
  name: string
  code: string
}

export type Category = {
  id: string
  name: string
  code: string
}

export type StaffUser = {
  id: string
  full_name: string
  email: string
  role: 'CITIZEN' | 'ADMIN' | 'FUNCIONARIO' | 'TECNICO' | 'RESPONSABLE_AREA'
  area_id: string | null
  is_active: boolean
  areas?: Area | null
}

export type Report = {
  id: string
  title: string
  description: string
  status: ReportStatus
  priority: Priority
  latitude: string | number | null
  longitude: string | number | null
  address: string | null
  neighborhood: string | null
  created_at: string
  updated_at: string
  resolved_at: string | null
  categories?: Category | null
  areas?: Area | null
  assigned_user?: StaffUser | null
  citizen?: StaffUser | null
}

export type Evidence = {
  id: string
  report_id: string
  file_url: string
  file_name: string | null
  file_type: string | null
}

export type TrackingEntry = {
  id: string
  report_id: string
  previous_status: ReportStatus | null
  new_status: ReportStatus
  comment: string | null
  created_at: string
  users?: StaffUser | null
}
