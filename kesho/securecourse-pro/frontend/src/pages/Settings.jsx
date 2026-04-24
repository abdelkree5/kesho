import { useState } from 'react'
import { useAuthStore, useThemeStore } from '../store'
import toast from 'react-hot-toast'
import { Moon, Sun, Bell, Shield, User } from 'lucide-react'

export default function SettingsPage() {
  const { user } = useAuthStore()
  const { dark, toggle } = useThemeStore()
  const [notifs, setNotifs] = useState({ email: true, push: false, promo: true })
  const [name, setName] = useState(user?.name || '')

  return (
    <div className="max-w-2xl space-y-6" dir="rtl">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">الإعدادات</h1>

      {/* Profile */}
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <User size={18} className="text-brand-600" />
          <h2 className="font-semibold text-gray-800 dark:text-white">الملف الشخصي</h2>
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">الاسم</label>
            <input className="input" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">البريد الإلكتروني</label>
            <input className="input" value={user?.email || ''} disabled className="input opacity-60 cursor-not-allowed" />
          </div>
          <button onClick={() => toast.success('تم حفظ الملف الشخصي')} className="btn-primary">حفظ</button>
        </div>
      </div>

      {/* Theme */}
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          {dark ? <Moon size={18} className="text-brand-600" /> : <Sun size={18} className="text-brand-600" />}
          <h2 className="font-semibold text-gray-800 dark:text-white">المظهر</h2>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600 dark:text-gray-400">الوضع الداكن</p>
          <button onClick={toggle}
            className={`w-12 h-6 rounded-full transition-colors duration-200 relative ${dark ? 'bg-brand-600' : 'bg-gray-200'}`}>
            <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all duration-200 shadow ${dark ? 'right-0.5' : 'left-0.5'}`} />
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <Bell size={18} className="text-brand-600" />
          <h2 className="font-semibold text-gray-800 dark:text-white">الإشعارات</h2>
        </div>
        <div className="space-y-3">
          {[
            { key: 'email', label: 'إشعارات البريد الإلكتروني' },
            { key: 'push', label: 'الإشعارات الفورية' },
            { key: 'promo', label: 'العروض والتخفيضات' },
          ].map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
              <button onClick={() => setNotifs(n => ({ ...n, [key]: !n[key] }))}
                className={`w-12 h-6 rounded-full transition-colors duration-200 relative ${notifs[key] ? 'bg-brand-600' : 'bg-gray-200 dark:bg-gray-600'}`}>
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all duration-200 shadow ${notifs[key] ? 'right-0.5' : 'left-0.5'}`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Security */}
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <Shield size={18} className="text-brand-600" />
          <h2 className="font-semibold text-gray-800 dark:text-white">الأمان</h2>
        </div>
        <button onClick={() => toast.success('تم إرسال رابط تغيير كلمة المرور')}
          className="btn-ghost text-sm">تغيير كلمة المرور</button>
      </div>
    </div>
  )
}
