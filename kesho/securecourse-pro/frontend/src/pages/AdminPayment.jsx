import { useEffect, useState } from 'react'
import { paymentAPI } from '../services/api'
import toast from 'react-hot-toast'
import { Loader2, Save } from 'lucide-react'

const fields = [
  { key: 'vodafone_cash', label: 'Vodafone Cash', placeholder: '010XXXXXXXX' },
  { key: 'instapay', label: 'InstaPay', placeholder: 'account@instapay' },
  { key: 'fawry', label: 'Fawry', placeholder: 'FAWRY-XXXX-XXXX' },
]

export default function AdminPaymentPage() {
  const [values, setValues] = useState({ vodafone_cash: '', instapay: '', fawry: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    paymentAPI.getInfo()
      .then(r => {
        const map = {}
        r.data.forEach(({ method, value }) => { map[method] = value })
        setValues(v => ({ ...v, ...map }))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const save = async () => {
    setSaving(true)
    try {
      await Promise.all(fields.map(f => paymentAPI.update(f.key, values[f.key])))
      toast.success('تم حفظ التغييرات ✅')
    } catch {
      toast.error('فشل الحفظ، تحقق من الصلاحيات')
    }
    setSaving(false)
  }

  if (loading) return (
    <div className="flex items-center justify-center py-16">
      <Loader2 size={32} className="animate-spin text-brand-500" />
    </div>
  )

  return (
    <div className="max-w-lg" dir="rtl">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">⚙️ إعدادات الدفع</h1>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">تحديث بيانات طرق الدفع — أدمن فقط</p>

      <div className="card space-y-5">
        {fields.map(({ key, label, placeholder }) => (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{label}</label>
            <input className="input" placeholder={placeholder}
              value={values[key]}
              onChange={e => setValues(v => ({ ...v, [key]: e.target.value }))} />
          </div>
        ))}

        <button onClick={save} disabled={saving} className="btn-primary w-full flex items-center justify-center gap-2 mt-2">
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {saving ? 'جارٍ الحفظ...' : 'حفظ التغييرات'}
        </button>
      </div>
    </div>
  )
}
