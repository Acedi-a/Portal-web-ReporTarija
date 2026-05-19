import { QueryClientProvider } from '@tanstack/react-query'
import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { queryClient } from '../lib/queryClient'
import { ThemeContext, type Theme } from './theme'

type AppProvidersProps = {
  children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem('reportatarija-theme')
    return stored === 'dark' ? 'dark' : 'light'
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    document.documentElement.classList.toggle('light', theme === 'light')
    localStorage.setItem('reportatarija-theme', theme)
  }, [theme])

  const value = useMemo(
    () => ({
      theme,
      toggleTheme: () => setTheme((current) => (current === 'dark' ? 'light' : 'dark')),
    }),
    [theme],
  )

  return (
    <ThemeContext.Provider value={value}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ThemeContext.Provider>
  )
}
