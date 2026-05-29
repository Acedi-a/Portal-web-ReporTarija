# Patrones de diseño aplicados

Este documento resume los patrones de diseño identificados y aplicados en el portal municipal **ReportaTarija**.

## Repository

El patrón **Repository** centraliza el acceso a datos de cada entidad o feature. En el proyecto se aplica mediante servicios como:

- `src/features/reports/services/reportService.ts`
- `src/features/staff/services/staffService.ts`
- `src/features/notifications/services/notificationService.ts`
- `src/features/reports/tracking/services/trackingService.ts`
- `src/features/reports/services/evidenceService.ts`

Estos servicios encapsulan las operaciones con InsForge, como listar reportes, actualizar estados, asignar responsables, consultar funcionarios o crear notificaciones. Gracias a esto, los componentes no dependen directamente del backend ni conocen los detalles de la base de datos.

## Facade

El patrón **Facade** proporciona una interfaz simple para usar un conjunto de operaciones más complejas. En el proyecto se aplica principalmente con hooks personalizados:

- `src/features/reports/hooks/useReportDetail.ts`
- `src/features/reports/hooks/useReportsPageData.ts`
- `src/features/staff/hooks/useStaffManagement.ts`
- `src/features/notifications/hooks/useNotifications.ts`
- `src/features/auth/hooks/useLoginForm.ts`

Estos hooks agrupan queries, mutations, estados de formulario, validaciones y recarga de datos. Las páginas consumen una API más limpia y no necesitan conocer todos los detalles internos de TanStack Query, servicios o validaciones.

## Singleton

El patrón **Singleton** garantiza una única instancia compartida de un objeto importante. En el proyecto se aplica en:

- `src/lib/insforge.ts`
- `src/lib/queryClient.ts`

`insforge.ts` crea una única instancia del cliente de InsForge para comunicarse con backend, autenticación, storage y functions. `queryClient.ts` crea una única instancia de `QueryClient` para manejar cache y sincronización de datos en toda la aplicación.

## DTO

El patrón **DTO** se usa para transportar datos entre capas sin mezclar lógica de negocio. En el proyecto se crearon carpetas `dtos/` por feature:

- `src/features/auth/dtos/loginDto.ts`
- `src/features/staff/dtos/staffDtos.ts`
- `src/features/reports/dtos/reportActionDtos.ts`
- `src/features/reports/dtos/reportAiDtos.ts`
- `src/features/notifications/dtos/notificationDtos.ts`
- `src/features/reports/tracking/dtos/trackingDtos.ts`

Ejemplos aplicados:

- `LoginDto`
- `CreateStaffDto`
- `UpdateReportStatusDto`
- `AssignResponsibleDto`
- `CreateNotificationDto`
- `AnalyzeReportDto`

Estos DTOs definen qué datos se envían entre formularios, hooks, servicios, InsForge y la función de IA. En operaciones críticas también se usa Zod para validar los datos en tiempo de ejecución.

## Adapter

El patrón **Adapter** permite conectar el sistema con una interfaz externa sin acoplar el resto del código a sus detalles. En el proyecto se aplica en:

- `src/features/reports/ai/services/reportAiService.ts`

Este servicio adapta la llamada a la función `analyze-report` de InsForge. La interfaz externa de InsForge Functions y OpenRouter queda encapsulada detrás de una función propia del dominio: `analyzeReport`. Así, los componentes y hooks no necesitan conocer cómo se invoca el proveedor de IA.

## Observer

El patrón **Observer** permite que diferentes partes del sistema se actualicen cuando cambia una fuente de datos. En el proyecto se aplica mediante TanStack Query:

- `useQuery`
- `useMutation`
- `queryClient.invalidateQueries`

Por ejemplo, cuando se marca una notificación como leída, se invalidan las queries de notificaciones y del contador de no leídas. Las vistas que dependen de esos datos se actualizan automáticamente. Lo mismo ocurre al cambiar estado de reportes, asignar responsables o subir evidencias.

Este patrón ayuda a mantener sincronizadas las pantallas sin acoplar directamente los componentes entre sí.
