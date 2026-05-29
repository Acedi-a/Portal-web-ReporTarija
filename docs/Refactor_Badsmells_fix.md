# Refactor Bad Smells Fix

Resumen breve de la auditoría y refactorización aplicada al portal municipal **Panel ReportaTarija**.

## Reports


| Bad smell                        | Archivos principales                       | Solución aplicada                                                                                                        |
| -------------------------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| Bloater / Mixed responsibilities | `ReportsPage.tsx`, `ReportDetailPage.tsx`  | Se extrajeron hooks `useReportsPageData` y `useReportDetail` para queries, mutations, selección y lógica de formularios. |
| Too many props                   | `ReportFilters.tsx`, `useReportFilters.ts` | Se reemplazaron múltiples estados/setters por `ReportFiltersState`, `setFilter` y objetos `filters/options`.             |
| Magic numbers / config inline    | `ReportList.tsx`, `ReportMap.tsx`          | Se crearon `REPORTS_PAGE_SIZE` y `REPORT_MAP_CONFIG`; se agregó `usePagination`.                                         |
| Decompose conditional            | `ReportProgress.tsx`                       | Se movió lógica de pasos/clases a `reportProgress.ts`.                                                                   |
| Type smell UUID                  | `types/report.ts`                          | IDs de `Area`, `Category`, `Evidence`, `TrackingEntry` y `area_id` pasaron a `string`.                                   |
| Primitive validation             | `reportActions.ts`                         | Validaciones de estado/asignación migradas a Zod.                                                                        |
| Service long method              | `reportService.ts`                         | Se extrajeron `applyReportFilters` y `filterReportsBySearch`.                                                            |
| UI overloaded detail             | `ReportDetailPage.tsx`                     | Se rediseñó el detalle con `ReportDetailHero`, `ReportDetailStatsGrid`, `ReportActionsModal` y panel IA.                 |


## Reports AI


| Bad smell / necesidad           | Archivos principales               | Solución aplicada                                                                           |
| ------------------------------- | ---------------------------------- | ------------------------------------------------------------------------------------------- |
| API key en frontend             | `functions/analyze-report.js`      | Se creó InsForge Function `analyze-report`; OpenRouter se llama desde backend.              |
| Modelo configurable innecesario | `analyze-report.js`, `reportAi.ts` | Se fijó `deepseek/deepseek-v4-flash` con provider `alibaba`.                                |
| UI IA poco natural              | `ReportAiAssistant.tsx`            | Se cambió a informe textual tipo reporte municipal.                                         |
| Duplicación de llamada IA       | `ReportDetailPage.tsx`             | El hook `useReportAiAnalysis` se instancia una vez y se comparte con el informe y el modal. |
| Form manual repetitivo          | `ReportActionsModal.tsx`           | Se agregó autocompletado IA para estado, comentario y área sugerida.                        |


## Auth


| Bad smell                | Archivos principales                                | Solución aplicada                                                                      |
| ------------------------ | --------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Magic string / coupling  | `AuthGuard.tsx`, `useLoginForm.ts`, `AppLayout.tsx` | Se creó `authSession.ts` con `hasDemoSession`, `startDemoSession`, `clearDemoSession`. |
| Reinvented mutation      | `useLoginForm.ts`                                   | Login migrado a `useMutation` de TanStack Query.                                       |
| Contrato implícito       | `authService.ts`                                    | `getCurrentUser` ahora devuelve `data?.user ?? null`.                                  |
| Validación de formulario | `loginSchema.ts`                                    | Se mantuvo Zod como fuente de validación del login.                                    |


## Dashboard


| Bad smell                        | Archivos principales                              | Solución aplicada                                                                                                                |
| -------------------------------- | ------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Bloater / Mixed responsibilities | `DashboardPage.tsx`                               | Se extrajeron `useDashboardData`, `DashboardStatGrid`, `ReportsByStatusChart`, `RecentReportsList`, `OperationalReportsSummary`. |
| Magic values                     | `DashboardPage.tsx`                               | Se creó `dashboardOptions.ts` con colores y límite de reportes recientes.                                                        |
| Component placement              | `StatCard`                                        | `StatCard` se movió a `shared/components/ui/StatCard.tsx`.                                                                       |
| Feature muerta / coupling        | `summary/pages/ReportsSummaryPage.tsx`            | `summary` fue eliminado y absorbido por Dashboard.                                                                               |
| Texto desactualizado             | `reportDates.ts`, `OperationalReportsSummary.tsx` | Se exportó `REPORT_OVERDUE_DAYS = 15` y se reutilizó en UI.                                                                      |


## Notifications


| Bad smell                     | Archivos principales                              | Solución aplicada                                                                                         |
| ----------------------------- | ------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Mixed responsibilities        | `NotificationsPage.tsx`                           | Se creó `useNotifications` y componentes `NotificationList`, `NotificationCard`, `NotificationReadBadge`. |
| Unsafe cast / duplicated type | `NotificationsPage.tsx`, `notificationService.ts` | Se creó `types/notification.ts`; `getNotifications` devuelve `PortalNotification[]`.                      |
| Magic number                  | `notificationService.ts`                          | Se creó `NOTIFICATIONS_LIMIT`.                                                                            |
| Repeated insert logic         | `notificationService.ts`                          | Se creó `createNotification`.                                                                             |
| Missing states                | `NotificationList.tsx`, `NotificationsPage.tsx`   | Se agregaron estados de carga y vacío.                                                                    |
| Conteo no leído               | `AppLayout.tsx`, `notificationService.ts`         | Se agregó badge en sidebar con `getUnreadNotificationsCount`.                                             |
| Bulk action faltante          | `NotificationsToolbar.tsx`                        | Se agregó “Marcar todas como leídas”.                                                                     |


## Staff


| Bad smell                        | Archivos principales              | Solución aplicada                                                                   |
| -------------------------------- | --------------------------------- | ----------------------------------------------------------------------------------- |
| Bloater / Mixed responsibilities | `StaffPage.tsx`                   | Se creó `useStaffManagement` para queries, mutations, edición, submit y formulario. |
| Primitive validation             | `StaffPage.tsx`                   | Validación migrada a Zod con `staffSchema.ts`.                                      |
| Data loss al editar roles        | `StaffPage.tsx`, `StaffForm.tsx`  | Se preservan roles `ADMIN`, `FUNCIONARIO`, `TECNICO`, `RESPONSABLE_AREA`.           |
| Incomplete options               | `StaffForm.tsx`, `StaffTable.tsx` | Se creó `staffOptions.ts` con labels/opciones compartidas.s                         |
| Unsafe cast                      | `StaffForm.tsx`                   | Se agregó `isStaffRole`.                                                            |
| Decompose conditional            | `StaffTable.tsx`                  | Se creó `StaffStatusBadge`.                                                         |
| Repeated select string           | `staffService.ts`                 | Se creó constante `staffSelect`.                                                    |


## Tracking


| Bad smell             | Archivos principales    | Solución aplicada                                              |
| --------------------- | ----------------------- | -------------------------------------------------------------- |
| Over-organization     | `src/features/tracking` | Se integró como subfeature en `src/features/reports/tracking`. |
| Missing empty state   | `TrackingTimeline.tsx`  | Se agregó mensaje cuando no hay historial.                     |
| Inline item rendering | `TrackingTimeline.tsx`  | Se extrajo `TrackingTimelineItem`.                             |
| Magic strings         | `trackingService.ts`    | Se crearon `trackingSelect` y `defaultTrackingComment`.        |


## Verificación

Durante los cambios se ejecutó recurrentemente:

```bash
pnpm lint
pnpm build
```

Ambos comandos pasan. Queda únicamente el warning conocido de Vite por chunk grande.

# Se procede con la creación de tests

