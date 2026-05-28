import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppLayout } from '../shared/components/layout/AppLayout'
import { AuthGuard } from '../features/auth/components/AuthGuard'
import { LoginPage } from '../features/auth/pages/LoginPage'
import { DashboardPage } from '../features/dashboard/pages/DashboardPage'
import { ReportsPage } from '../features/reports/pages/ReportsPage'
import { ReportDetailPage } from '../features/reports/pages/ReportDetailPage'
import { StaffPage } from '../features/staff/pages/StaffPage'
import { NotificationsPage } from '../features/notifications/pages/NotificationsPage'
import { NotFoundPage } from '../shared/pages/NotFoundPage'

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    path: '/',
    element: <AuthGuard />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { index: true, element: <Navigate to="/dashboard" replace /> },
          { path: 'dashboard', element: <DashboardPage /> },
          { path: 'reports', element: <ReportsPage /> },
          { path: 'reports/:id', element: <ReportDetailPage /> },
          { path: 'staff', element: <StaffPage /> },
          { path: 'notifications', element: <NotificationsPage /> },
          { path: '*', element: <NotFoundPage /> },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to="/dashboard" replace /> },
])
