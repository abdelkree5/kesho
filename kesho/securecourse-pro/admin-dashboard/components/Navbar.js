import { useRouter } from 'next/router';

export default function Navbar({ title }) {
  const router = useRouter();

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('sc-admin-token');
    }
    router.push('/login');
  };

  return (
    <div className="mb-6 flex flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-900/90 px-6 py-5 shadow-lg shadow-slate-950/20 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Admin panel</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">{title}</h1>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={handleLogout}
          className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-slate-200 transition hover:border-brand"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
