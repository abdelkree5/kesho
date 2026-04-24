import { useEffect, useState } from 'react'
import { paymentAPI } from '../services/api'
import { Phone, Building2, Store, Copy, CheckCheck, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

const icons = {
  vodafone_cash: { icon: Phone, label: 'Vodafone Cash', color: 'bg-red-50 dark:bg-red-900/20 text-red-600', border: 'border-red-100 dark:border-red-900/30' },
  instapay: { icon: Building2, label: 'InstaPay', color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600', border: 'border-blue-100 dark:border-blue-900/30' },
  fawry: { icon: Store, label: 'Fawry', color: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600', border: 'border-amber-100 dark:border-amber-900/30' },
}

export default function PaymentPage() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(null)

  useEffect(() => {
    paymentAPI.getInfo()
      .then(r => setData(r.data))
      .catch(() => {
        setData([
          { method: 'vodafone_cash', value: '01012345678', updated_at: new Date() },
          { method: 'instapay', value: 'securecourse@instapay', updated_at: new Date() },
          { method: 'fawry', value: 'FAWRY-9012-XXXX', updated_at: new Date() },
        ])
      })
      .finally(() => setLoading(false))
  }, [])

  const copy = (value, method) => {
    navigator.clipboard.writeText(value)
    setCopied(method)
    toast.success('تم النسخ!')
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="max-w-2xl" dir="rtl">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">طرق الدفع</h1>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">اختر طريقة الدفع المناسبة لك</p>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={32} className="animate-spin text-brand-500" />
        </div>
      ) : (
        <div className="space-y-4">
          {data.map(({ method, value }) => {
            const cfg = icons[method] || { icon: Store, label: method, color: 'bg-gray-50 text-gray-600', border: 'border-gray-100' }
            const Icon = cfg.icon
            return (
              <div key={method} className={`card border ${cfg.border} flex items-center justify-between`}>
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${cfg.color}`}>
                    <Icon size={22} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-gray-200">{cfg.label}</p>
                    <p className="text-lg font-mono text-gray-700 dark:text-gray-300 mt-0.5 tracking-wide">{value}</p>
                  </div>
                </div>
                <button onClick={() => copy(value, method)}
                  className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-500">
                  {copied === method ? <CheckCheck size={18} className="text-green-500" /> : <Copy size={18} />}
                </button>
              </div>
            )
          })}
        </div>
      )}

      <div className="mt-6 p-4 bg-brand-50 dark:bg-brand-900/20 rounded-2xl border border-brand-100 dark:border-brand-900/30">
        <p className="text-sm font-semibold text-brand-700 dark:text-brand-400 mb-1">⚡ تعليمات الدفع</p>
        <ul className="text-sm text-brand-600 dark:text-brand-500 space-y-1 list-disc list-inside">
          <li>أرسل المبلغ على أي طريقة دفع أعلاه</li>
          <li>احتفظ بلقطة شاشة للتحويل</li>
          <li>تواصل معنا لتفعيل الاشتراك خلال 24 ساعة</li>
        </ul>
      </div>
    </div>
  )
}
