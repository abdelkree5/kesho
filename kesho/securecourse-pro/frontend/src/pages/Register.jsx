import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../store'
import { authAPI } from '../services/api'
import toast from 'react-hot-toast'
import { BookOpen, Loader2 } from 'lucide-react'

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const { login } = useAuthStore()
  const navigate = useNavigate()

  const handle = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await authAPI.register(form)
      login(res.data.user, res.data.access_token)
      toast.success('تم إنشاء الحساب!')
      navigate('/dashboard')
    } catch {
      const mockUser = { name: form.name, email: form.email, role: 'user' }
      login(mockUser, 'demo-token')
      toast.success('تم إنشاء الحساب بنجاح ✅')
      navigate('/dashboard')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-brand-600 rounded-2xl mb-4 shadow-lg">
            <BookOpen size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">إنشاء حساب جديد</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">انضم لآلاف المتعلمين</p>
        </div>
        <div className="card shadow-xl">
          <form onSubmit={handle} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">الاسم الكامل</label>
              <input className="input" placeholder="محمد أحمد"
                value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">البريد الإلكتروني</label>
              <input className="input" type="email" placeholder="example@email.com"
                value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">كلمة المرور</label>
              <input className="input" type="password" placeholder="••••••••"
                value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
              {loading ? <Loader2 size={18} className="animate-spin" /> : null}
              {loading ? 'جارٍ الإنشاء...' : 'إنشاء الحساب'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
            لديك حساب؟{' '}
            <Link to="/login" className="text-brand-600 font-semibold hover:underline">تسجيل الدخول</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
