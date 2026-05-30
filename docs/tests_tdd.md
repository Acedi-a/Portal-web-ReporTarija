# Aplicacion de TDD

Se aplico la metodologia **TDD (Test Driven Development)** sobre reglas de negocio y validaciones importantes del portal municipal ReportaTarija. TDD no es un tipo de prueba, sino una forma de desarrollo basada en escribir primero pruebas automatizadas que definen el comportamiento esperado.

Como el proyecto ya contaba con una base funcional previa y una fase de refactorizacion, TDD se uso para consolidar funcionalidades criticas, documentar el comportamiento esperado y reducir el riesgo de regresiones futuras.

La forma resumida de describir el trabajo es:

```txt
Se aplico TDD mediante 7 pruebas automatizadas con Vitest,
agrupadas en 5 funcionalidades criticas del portal ReportaTarija.
```

## Ciclo Red, Green y Refactor aplicado

### Fase Red

Se definieron pruebas automatizadas que expresan reglas esperadas del sistema. Por ejemplo:

- El login debe aceptar credenciales validas y rechazar credenciales invalidas.
- Un reporte rechazado debe exigir comentario.
- Una asignacion debe incluir responsable o area municipal.
- El dashboard debe contar reportes por estado.
- Un reporte resuelto no debe aparecer como vencido.

Estas pruebas funcionan como especificacion viva del comportamiento esperado.

### Fase Green

Se ejecuto la suite con Vitest y se verifico que la logica existente cumpliera con esas reglas. Cuando una regla no estaba cubierta por pruebas, se agrego el caso correspondiente.

### Fase Refactor

Las pruebas se organizaron dentro de las features correspondientes, manteniendo la arquitectura modular del proyecto y evitando mezclar reglas de negocio con componentes visuales.

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

Los 7 tests pertenecen a 5 funcionalidades criticas:

```txt
1. Login
2. Cambio de estado de reporte
3. Asignacion de responsable o area
4. Metricas del dashboard
5. Reglas de vencimiento de reportes
```

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
