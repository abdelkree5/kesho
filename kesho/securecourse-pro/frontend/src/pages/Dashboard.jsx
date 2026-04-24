import { useAuthStore } from '../store'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { Users, BookOpen, TrendingUp, Star } from 'lucide-react'

const chartData = [
  { name: 'يناير', students: 120, revenue: 4200 },
  { name: 'فبراير', students: 180, revenue: 6300 },
  { name: 'مارس', students: 150, revenue: 5100 },
  { name: 'أبريل', students: 260, revenue: 9100 },
  { name: 'مايو', students: 310, revenue: 10850 },
  { name: 'يونيو', students: 290, revenue: 10150 },
  { name: 'يوليو', students: 380, revenue: 13300 },
]

const activity = [
  { user: 'أحمد محمد', action: 'اشترى كورس React المتقدم', time: 'منذ 5 دقائق', avatar: 'أ' },
  { user: 'سارة علي', action: 'أكملت الوحدة الثالثة', time: 'منذ 12 دقيقة', avatar: 'س' },
  { user: 'محمود حسن', action: 'سجّل في المنصة', time: 'منذ 25 دقيقة', avatar: 'م' },
  { user: 'نور خالد', action: 'اشترت كورس Python', time: 'منذ ساعة', avatar: 'ن' },
]

const stats = [
  { label: 'إجمالي الطلاب', value: '2,847', change: '+12%', icon: Users, color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' },
  { label: 'الكورسات النشطة', value: '24', change: '+3', icon: BookOpen, color: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600' },
  { label: 'الإيراد الشهري', value: '13,300 ج', change: '+8%', icon: TrendingUp, color: 'bg-green-50 dark:bg-green-900/20 text-green-600' },
  { label: 'متوسط التقييم', value: '4.8 ★', change: '+0.2', icon: Star, color: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600' },
]

export default function DashboardHome() {
  const { user } = useAuthStore()

  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          أهلاً، {user?.name || 'مستخدم'} 👋
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">إليك ملخص نشاط المنصة اليوم</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, change, icon: Icon, color }) => (
          <div key={label} className="card">
            <div className={`inline-flex p-2.5 rounded-xl mb-3 ${color}`}>
              <Icon size={20} />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{label}</p>
            <p className="text-xs text-green-600 font-medium mt-1">{change} هذا الشهر</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Area Chart */}
        <div className="card lg:col-span-2">
          <h2 className="font-semibold text-gray-800 dark:text-white mb-4">نمو الإيراد</h2>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" tick={{ fontSize: 11, fontFamily: 'Cairo' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontFamily: 'Cairo', borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2.5} fill="url(#rev)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Activity */}
        <div className="card">
          <h2 className="font-semibold text-gray-800 dark:text-white mb-4">آخر النشاطات</h2>
          <div className="space-y-4">
            {activity.map((a, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center text-brand-700 dark:text-brand-400 text-sm font-bold flex-shrink-0">
                  {a.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{a.user}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{a.action}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bar chart */}
      <div className="card">
        <h2 className="font-semibold text-gray-800 dark:text-white mb-4">الطلاب الجدد شهرياً</h2>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" tick={{ fontSize: 11, fontFamily: 'Cairo' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ fontFamily: 'Cairo', borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
            <Bar dataKey="students" fill="#6366f1" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
