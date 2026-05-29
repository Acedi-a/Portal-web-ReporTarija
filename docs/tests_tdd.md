# Pruebas TDD aplicadas

Se incorporaron pruebas TDD sobre reglas de negocio y validaciones importantes del portal municipal ReportaTarija. Las pruebas se enfocan en lógica verificable sin depender de la interfaz visual ni de la conexión real con InsForge.

## Herramienta utilizada

- **Vitest** como runner de pruebas.
- Script agregado:

```bash
pnpm test
```

## Archivos de prueba

```txt
src/features/auth/tests/loginDto.test.ts
src/features/reports/tests/reportActionDtos.test.ts
src/features/reports/tests/reportBusinessRules.test.ts
```

## Tests implementados

| # | Test | Archivo | Que verifica |
|---|---|---|---|
| 1 | Acepta credenciales validas en login | `loginDto.test.ts` | Valida que un correo correcto y una contrasena suficiente pasen el esquema de login. |
| 2 | Rechaza credenciales invalidas en login | `loginDto.test.ts` | Verifica que un email invalido y una contrasena corta sean rechazados. |
| 3 | Exige comentario al rechazar un reporte | `reportActionDtos.test.ts` | Comprueba que un reporte no pueda pasar a `RECHAZADO` sin comentario. |
| 4 | Exige responsable o area al asignar un reporte | `reportActionDtos.test.ts` | Comprueba que una asignacion sin funcionario ni area municipal sea invalida. |
| 5 | Cuenta reportes por estado para el dashboard | `reportBusinessRules.test.ts` | Verifica que las metricas del dashboard calculen correctamente reportes por estado. |
| 6 | Marca como vencido un reporte pendiente con 15 dias o mas | `reportBusinessRules.test.ts` | Comprueba que un reporte abierto por 15 dias sea considerado vencido. |
| 7 | No marca como vencido un reporte resuelto aunque tenga 15 dias o mas | `reportBusinessRules.test.ts` | Verifica que reportes cerrados no aparezcan como vencidos. |

## Resultado de ejecucion

```txt
Test Files  3 passed (3)
Tests       7 passed (7)
```

Tambien se ejecuto el build del proyecto:

```bash
pnpm build
```

El proyecto compila correctamente.
