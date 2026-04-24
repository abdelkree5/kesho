import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useEffect } from 'react'
import { useAuthStore, useThemeStore } from './store'
import LoginPage from './pages/Login'
import RegisterPage from './pages/Register'
import DashboardLayout from './components/DashboardLayout'
import DashboardHome from './pages/Dashboard'
import PaymentPage from './pages/Payment'
import AdminPaymentPage from './pages/AdminPayment'
import CoursesPage from './pages/Courses'
import SettingsPage from './pages/Settings'
import PricingPage from './pages/Pricing'

function Protected({ children, adminOnly = false }) {
  const { token, isAdmin } = useAuthStore()
  if (!token) return <Navigate to="/login" replace />
  if (adminOnly && !isAdmin) return <Navigate to="/dashboard" replace />
  return children
}

export default function App() {
  const { init } = useThemeStore()
  useEffect(() => { init() }, [])

  return (
    <BrowserRouter>
      <Toaster position="top-center" toastOptions={{ style: { fontFamily: 'Cairo, sans-serif' } }} />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/" element={<Protected><DashboardLayout /></Protected>}>
          <Route path="dashboard" element={<DashboardHome />} />
          <Route path="courses" element={<CoursesPage />} />
          <Route path="payment" element={<PaymentPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="admin/payment" element={
            <Protected adminOnly><AdminPaymentPage /></Protected>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
