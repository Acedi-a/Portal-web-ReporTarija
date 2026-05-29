import { describe, expect, test } from 'vitest'
import { assignmentFormDtoSchema, statusChangeFormDtoSchema } from '../dtos/reportActionDtos'

describe('report action DTOs', () => {
  test('exige comentario al rechazar un reporte', () => {
    const result = statusChangeFormDtoSchema.safeParse({
      newStatus: 'RECHAZADO',
      comment: '   ',
    })

    expect(result.success).toBe(false)
    expect(result.error?.issues[0]?.message).toBe('Para rechazar un reporte debes registrar un comentario.')
  })

  test('exige responsable o area al asignar un reporte', () => {
    const result = assignmentFormDtoSchema.safeParse({
      userId: '',
      areaId: '',
    })

    expect(result.success).toBe(false)
    expect(result.error?.issues[0]?.message).toBe('Selecciona un responsable o un area municipal.')
  })
})
