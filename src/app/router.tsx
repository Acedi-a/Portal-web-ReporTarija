import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppLayout } from '../shared/components/layout/AppLayout'
import { LoginPage } from '../features/auth/pages/LoginPage'
import { DashboardPage } from '../features/dashboard/pages/DashboardPage'
import { ReportsPage } from '../features/reports/pages/ReportsPage'
import { ReportDetailPage } from '../features/reports/pages/ReportDetailPage'
import { StaffPage } from '../features/staff/pages/StaffPage'
import { NotificationsPage } from '../features/notifications/pages/NotificationsPage'
import { ReportsSummaryPage } from '../features/summary/pages/ReportsSummaryPage'

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'reports', element: <ReportsPage /> },
      { path: 'reports/:id', element: <ReportDetailPage /> },
      { path: 'staff', element: <StaffPage /> },
      { path: 'notifications', element: <NotificationsPage /> },
      { path: 'reports-summary', element: <ReportsSummaryPage /> },
    ],
  },
])
