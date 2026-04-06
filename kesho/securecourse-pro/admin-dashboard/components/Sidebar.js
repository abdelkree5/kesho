import Link from 'next/link';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', key: 'dashboard' },
  { label: 'Codes', href: '/codes', key: 'codes' },
  { label: 'Courses', href: '/courses', key: 'courses' },
  { label: 'Videos', href: '/videos', key: 'videos' },
];

export default function Sidebar({ active }) {
  return (
    <aside className="hidden w-[280px] shrink-0 border-r border-slate-800 bg-slate-950 p-6 lg:block">
      <div className="space-y-6">
        <div>
          <p className="text-2xl font-semibold text-white">SecureCourse</p>
          <p className="mt-1 text-sm text-slate-400">Admin dashboard</p>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link key={item.key} href={item.href}>
              <a
                className={`block rounded-3xl px-4 py-3 text-sm font-medium transition ${
                  active === item.key
                    ? 'bg-brand text-white shadow-lg shadow-brand/20'
                    : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                }`}
              >
                {item.label}
              </a>
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}
