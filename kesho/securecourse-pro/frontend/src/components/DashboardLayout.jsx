import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore, useThemeStore } from '../store'
import { LayoutDashboard, BookOpen, CreditCard, Settings, LogOut, Moon, Sun, ShieldCheck, Menu, X } from 'lucide-react'
import { useState } from 'react'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'الرئيسية' },
  { to: '/courses', icon: BookOpen, label: 'الكورسات' },
  { to: '/payment', icon: CreditCard, label: 'الدفع' },
  { to: '/settings', icon: Settings, label: 'الإعدادات' },
]

export default function DashboardLayout() {
  const { user, logout, isAdmin } = useAuthStore()
  const { dark, toggle } = useThemeStore()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const handleLogout = () => { logout(); navigate('/login') }

  const Sidebar = () => (
    <aside className="flex flex-col h-full bg-gradient-to-b from-brand-700 to-brand-900 text-white w-64 p-4">
      <div className="flex items-center gap-3 px-2 py-4 mb-6">
        <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
          <BookOpen size={18} className="text-white" />
        </div>
        <div>
          <p className="font-bold text-base leading-none">SecureCourse</p>
          <p className="text-white/60 text-xs mt-1">Pro Platform</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} onClick={() => setOpen(false)}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : 'text-white/70'}`}>
            <Icon size={18} /> {label}
          </NavLink>
        ))}
        {isAdmin && (
          <NavLink to="/admin/payment" onClick={() => setOpen(false)}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : 'text-white/70'}`}>
            <ShieldCheck size={18} /> إعدادات الدفع
          </NavLink>
        )}
      </nav>

      <div className="border-t border-white/20 pt-4 mt-4">
        <div className="flex items-center gap-3 px-2 mb-3">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm font-bold">
            {user?.name?.[0] || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name || 'مستخدم'}</p>
            <p className="text-white/50 text-xs truncate">{user?.email || ''}</p>
          </div>
        </div>
        <button onClick={handleLogout}
          className="sidebar-link text-white/70 w-full">
          <LogOut size={16} /> تسجيل الخروج
        </button>
      </div>
    </aside>
  )

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden" dir="rtl">
      {/* Desktop sidebar */}
      <div className="hidden md:flex flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile sidebar */}
      {open && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="w-64 flex-shrink-0"><Sidebar /></div>
          <div className="flex-1 bg-black/40" onClick={() => setOpen(false)} />
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 px-6 py-3 flex items-center justify-between flex-shrink-0">
          <button className="md:hidden" onClick={() => setOpen(true)}>
            <Menu size={22} className="text-gray-600 dark:text-gray-300" />
          </button>
          <div className="flex items-center gap-2 mr-auto">
            <NavLink to="/pricing"
              className="text-xs font-semibold bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 px-3 py-1.5 rounded-lg hover:bg-brand-100 transition-colors">
              ترقية للـ Pro ✨
            </NavLink>
            <button onClick={toggle}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300">
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
