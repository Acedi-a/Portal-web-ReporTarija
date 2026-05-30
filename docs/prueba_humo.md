# Prueba de humo

La prueba de humo es una **prueba de software por objetivo**. Su finalidad es verificar rapidamente que el sistema tiene una estabilidad minima antes de realizar pruebas mas detalladas.

En este proyecto se implemento una prueba de humo automatizada para el portal municipal ReportaTarija usando **Playwright**.

## Objetivo de la prueba

Comprobar que el portal:

- Carga correctamente.
- Muestra la pantalla de login.
- Permite ingresar con una cuenta administrativa real.
- Abre el dashboard.
- Permite navegar por las secciones principales.
- Muestra elementos minimos esperados en cada pantalla principal.
- No presenta errores criticos durante el flujo basico.

## Archivo implementado

```txt
tests/smoke/portal.smoke.spec.ts
```

## Flujo automatizado

La prueba ejecuta automaticamente estos pasos:

```txt
1. Abre la ruta /login.
2. Verifica que aparezca "Inicio de sesión".
3. Verifica campos y botones principales del login.
4. Ingresa las credenciales del administrador.
5. Verifica que cargue /dashboard.
6. Verifica que aparezca "Dashboard municipal" y el menu principal.
7. Navega a Reportes.
8. Verifica que cargue /reports y que existan filtros, busqueda y controles de vista.
9. Navega a Accesos.
10. Verifica que cargue /staff y que exista el formulario de acceso administrativo.
11. Navega a Notificaciones.
12. Verifica que cargue /notifications y que existan controles basicos de notificaciones.
```

## Comando de ejecucion

```bash
pnpm test:smoke
```

Resultado esperado:

```txt
1 passed
```

Credenciales usadas por defecto en la prueba:

```txt
SMOKE_ADMIN_EMAIL=admin@reportatarija.bo
SMOKE_ADMIN_PASSWORD=Admin123
```

Tambien pueden sobrescribirse desde variables de entorno si se cambia la cuenta de prueba.

## Ver la prueba en navegador

Por defecto Playwright ejecuta la prueba sin mostrar el navegador. Para ver la navegacion automatica en pantalla se puede ejecutar:

```bash
pnpm exec playwright test tests/smoke --headed
```

Tambien se puede usar la interfaz visual de Playwright:

```bash
pnpm exec playwright test tests/smoke --ui
```

## Clasificacion


| Clasificacion  | Tipo                    |
| -------------- | ----------------------- |
| Por objetivo   | Prueba de humo          |
| Alcance        | Flujo basico del portal |
| Herramienta    | Playwright              |
| Automatizacion | Si                      |


Esta prueba no valida todas las reglas internas del sistema ni ejecuta acciones complejas como crear funcionarios, cambiar estados o asignar responsables. Su proposito es confirmar rapidamente que el portal inicia, permite iniciar sesion con una cuenta administrativa real, mantiene funcionando la navegacion principal y muestra los elementos esenciales de cada pantalla. Si esta prueba falla, significa que existe un problema critico que debe corregirse antes de continuar con pruebas mas profundas.