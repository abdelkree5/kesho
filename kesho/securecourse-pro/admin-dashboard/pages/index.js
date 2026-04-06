import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== 'undefined' ? window.localStorage.getItem('sc-admin-token') : null;
    router.replace(token ? '/dashboard' : '/login');
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
      <div className="text-center p-8 rounded-3xl border border-slate-700 shadow-xl shadow-slate-900/40">
        <p className="text-2xl font-semibold">SecureCourse Pro Admin Dashboard</p>
        <p className="mt-3 text-slate-400">Redirecting to login...</p>
      </div>
    </div>
  );
}
