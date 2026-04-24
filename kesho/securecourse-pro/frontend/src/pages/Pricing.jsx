import { Check, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'

const plans = [
  {
    name: 'مجاني', price: 0, period: 'للأبد',
    desc: 'ابدأ رحلتك التعليمية',
    color: 'border-gray-200 dark:border-gray-700',
    btn: 'btn-ghost',
    features: ['3 كورسات مجانية', 'شهادات أساسية', 'دعم عبر البريد', 'وصول محدود للمحتوى'],
  },
  {
    name: 'Pro', price: 99, period: '/شهر',
    desc: 'الأكثر شعبية للمتعلمين الجادين',
    color: 'border-brand-500 ring-2 ring-brand-500',
    btn: 'btn-primary',
    badge: 'الأكثر شعبية',
    features: ['جميع الكورسات غير محدودة', 'شهادات معتمدة', 'دعم أولوية 24/7', 'مشاريع عملية', 'وصول مدى الحياة'],
  },
  {
    name: 'Premium', price: 199, period: '/شهر',
    desc: 'للشركات والفرق',
    color: 'border-gray-200 dark:border-gray-700',
    btn: 'btn-ghost',
    features: ['كل مميزات Pro', 'حسابات متعددة', 'لوحة تحكم للفريق', 'تقارير مفصلة', 'مدرب خاص', 'API Access'],
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-16 px-4" dir="rtl">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
            <Zap size={14} /> خطط الأسعار
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">اختر خطتك</h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg">استثمر في مستقبلك التعليمي</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {plans.map(plan => (
            <div key={plan.name} className={`bg-white dark:bg-gray-800 rounded-2xl border-2 ${plan.color} p-6 relative`}>
              {plan.badge && (
                <div className="absolute -top-3 right-1/2 translate-x-1/2 bg-brand-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                  {plan.badge}
                </div>
              )}
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{plan.name}</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 mb-4">{plan.desc}</p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">{plan.price}</span>
                <span className="text-gray-500 text-sm">ج{plan.period}</span>
              </div>
              <Link to="/login" className={`${plan.btn} w-full block text-center mb-6`}>
                {plan.price === 0 ? 'ابدأ مجاناً' : `اشترك في ${plan.name}`}
              </Link>
              <ul className="space-y-3">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <Check size={16} className="text-green-500 flex-shrink-0" /> {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="text-center text-gray-500 dark:text-gray-400 text-sm mt-8">
          لديك سؤال؟ <a href="mailto:support@securecourse.com" className="text-brand-600 font-semibold hover:underline">تواصل معنا</a>
        </p>
      </div>
    </div>
  )
}
