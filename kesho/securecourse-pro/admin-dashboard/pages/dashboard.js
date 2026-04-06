import { useEffect, useState } from 'react';
import Head from 'next/head';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import api from '../services/api';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const response = await api.get('/admin/stats');
        setStats(response.data);
      } catch (err) {
        setError(err.response?.data?.detail || 'Could not load dashboard stats.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Head>
        <title>Dashboard | SecureCourse Pro Admin</title>
      </Head>
      <div className="flex min-h-screen">
        <Sidebar active="dashboard" />
        <div className="flex-1 px-4 py-6 md:px-8">
          <Navbar title="Dashboard" />

          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-lg shadow-slate-950/30">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Overview</p>
                  <h1 className="mt-2 text-3xl font-semibold">Admin performance</h1>
                </div>
                <p className="rounded-full bg-slate-800 px-4 py-2 text-sm text-slate-300">SecureCourse Pro</p>
              </div>
            </div>

            {loading ? (
              <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-8 text-center text-slate-400">Loading stats...</div>
            ) : error ? (
              <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-6 text-red-200">{error}</div>
            ) : (
              <div className="grid gap-6 md:grid-cols-3">
                <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-sm shadow-slate-950/20">
                  <p className="text-sm text-slate-400">Total Users</p>
                  <p className="mt-4 text-4xl font-semibold text-white">{stats.users ?? 0}</p>
                </div>
                <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-sm shadow-slate-950/20">
                  <p className="text-sm text-slate-400">Total Codes</p>
                  <p className="mt-4 text-4xl font-semibold text-white">{stats.codes_total ?? 0}</p>
                </div>
                <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-sm shadow-slate-950/20">
                  <p className="text-sm text-slate-400">Codes Used</p>
                  <p className="mt-4 text-4xl font-semibold text-white">{stats.codes_used ?? 0}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
