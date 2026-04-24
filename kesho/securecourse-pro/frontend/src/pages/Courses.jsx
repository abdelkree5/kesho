import { useState } from 'react'
import { BookOpen, Clock, Users, Star } from 'lucide-react'

const courses = [
  { id: 1, title: 'React من الصفر للاحتراف', desc: 'تعلم React.js بشكل كامل مع مشاريع حقيقية', price: 299, hours: 24, students: 1240, rating: 4.9, badge: 'الأكثر مبيعاً', color: 'from-blue-500 to-indigo-600' },
  { id: 2, title: 'Python للمبتدئين', desc: 'ابدأ رحلتك في البرمجة مع Python', price: 199, hours: 18, students: 890, rating: 4.8, badge: 'جديد', color: 'from-green-500 to-teal-600' },
  { id: 3, title: 'Flutter & Dart', desc: 'طور تطبيقات موبايل احترافية', price: 349, hours: 30, students: 560, rating: 4.7, badge: null, color: 'from-blue-400 to-cyan-500' },
  { id: 4, title: 'Node.js والـ Backend', desc: 'أنشئ APIs قوية مع Node.js وExpress', price: 279, hours: 22, students: 710, rating: 4.8, badge: null, color: 'from-green-600 to-emerald-700' },
  { id: 5, title: 'UI/UX Design', desc: 'تصميم واجهات مستخدم احترافية مع Figma', price: 249, hours: 16, students: 430, rating: 4.9, badge: 'مميز', color: 'from-pink-500 to-rose-600' },
  { id: 6, title: 'DevOps & Docker', desc: 'نشر التطبيقات واستخدام Docker وCI/CD', price: 399, hours: 28, students: 320, rating: 4.7, badge: null, color: 'from-orange-500 to-amber-600' },
]

export default function CoursesPage() {
  const [search, setSearch] = useState('')
  const filtered = courses.filter(c =>
    c.title.includes(search) || c.desc.includes(search)
  )

  return (
    <div dir="rtl">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">الكورسات</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{courses.length} كورس متاح</p>
        </div>
        <input className="input w-64" placeholder="ابحث عن كورس..."
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map(c => (
          <div key={c.id} className="card overflow-hidden hover:shadow-md transition-shadow duration-300 group">
            <div className={`h-28 bg-gradient-to-br ${c.color} rounded-xl mb-4 flex items-center justify-center relative`}>
              <BookOpen size={36} className="text-white/80" />
              {c.badge && (
                <span className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-lg">
                  {c.badge}
                </span>
              )}
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-1">{c.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{c.desc}</p>
            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-4">
              <span className="flex items-center gap-1"><Clock size={12} /> {c.hours} ساعة</span>
              <span className="flex items-center gap-1"><Users size={12} /> {c.students.toLocaleString()}</span>
              <span className="flex items-center gap-1 text-amber-500"><Star size={12} fill="currentColor" /> {c.rating}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold text-brand-600 dark:text-brand-400">{c.price} ج</span>
              <button className="btn-primary text-sm py-2 px-4">اشتراك الآن</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
