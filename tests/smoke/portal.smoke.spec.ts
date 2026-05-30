import { expect, test } from '@playwright/test'

const adminEmail = process.env.VITE_SMOKE_ADMIN_EMAIL
const adminPassword = process.env.VITE_SMOKE_ADMIN_PASSWORD

if (!adminEmail || !adminPassword) {
  throw new Error('Configura VITE_SMOKE_ADMIN_EMAIL y VITE_SMOKE_ADMIN_PASSWORD en el archivo .env.')
}

test('prueba de humo del portal municipal', async ({ page }) => {
  await page.goto('/login')

  await expect(page.getByRole('heading', { name: 'Inicio de sesión' })).toBeVisible()
  await expect(page.getByLabel('Correo')).toBeVisible()
  await expect(page.getByLabel('Contraseña')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Iniciar sesión' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Entrar al prototipo demo' })).toBeVisible()

  await page.getByLabel('Correo').fill(adminEmail)
  await page.getByLabel('Contraseña').fill(adminPassword)
  await page.getByRole('button', { name: 'Iniciar sesión' }).click()

  await expect(page).toHaveURL(/\/dashboard/)
  await expect(page.getByRole('heading', { name: 'Dashboard municipal' })).toBeVisible()
  await expect(page.getByText('Panel ReportaTarija').first()).toBeVisible()
  await expect(page.getByRole('link', { name: /Dashboard/ })).toBeVisible()
  await expect(page.getByRole('link', { name: /Reportes/ })).toBeVisible()
  await expect(page.getByRole('link', { name: /Accesos/ })).toBeVisible()
  await expect(page.getByRole('link', { name: /Notificaciones/ })).toBeVisible()

  await page.getByRole('link', { name: /Reportes/ }).click()
  await expect(page).toHaveURL(/\/reports/)
  await expect(page.getByRole('heading', { name: 'Gestión geográfica de reportes' })).toBeVisible()
  await expect(page.getByText('Filtros rápidos')).toBeVisible()
  await expect(page.getByPlaceholder('Buscar por título, zona o descripción')).toBeVisible()
  await expect(page.getByRole('button', { name: /Mapa/ })).toBeVisible()
  await expect(page.getByRole('button', { name: /Kanban/ })).toBeVisible()
  await expect(page.getByRole('button', { name: /Exportar CSV/ })).toBeVisible()

  await page.getByRole('link', { name: /Accesos/ }).click()
  await expect(page).toHaveURL(/\/staff/)
  await expect(page.getByRole('heading', { name: 'Accesos administrativos' })).toBeVisible()
  await expect(page.getByLabel('Nombre')).toBeVisible()
  await expect(page.getByLabel('Correo')).toBeVisible()
  await expect(page.getByLabel('Contraseña inicial')).toBeVisible()
  await expect(page.getByLabel('Tipo de acceso')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Crear acceso' })).toBeVisible()

  await page.getByRole('link', { name: /Notificaciones/ }).click()
  await expect(page).toHaveURL(/\/notifications/)
  await expect(page.getByRole('heading', { name: 'Notificaciones' })).toBeVisible()
  await expect(page.getByText(/sin leer/)).toBeVisible()
  await expect(page.getByRole('button', { name: /Marcar todas como leídas/ })).toBeVisible()
})
