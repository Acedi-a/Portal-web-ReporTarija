const DEMO_SESSION_KEY = 'reportatarija-demo-session'

export function hasDemoSession() {
  return localStorage.getItem(DEMO_SESSION_KEY) === 'true'
}

export function startDemoSession() {
  localStorage.setItem(DEMO_SESSION_KEY, 'true')
}

export function clearDemoSession() {
  localStorage.removeItem(DEMO_SESSION_KEY)
}
