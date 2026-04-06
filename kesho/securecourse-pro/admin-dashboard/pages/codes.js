import { useEffect, useState } from 'react';
import Head from 'next/head';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import api from '../services/api';

export default function CodesPage() {
  const [courseId, setCourseId] = useState('');
  const [count, setCount] = useState(3);
  const [generatedCodes, setGeneratedCodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleGenerate = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const response = await api.post('/admin/codes/generate', { course_id: Number(courseId), count: Number(count) });
      setGeneratedCodes(response.data.codes || []);
      setMessage(`Generated ${response.data.codes?.length ?? 0} codes.`);
    } catch (err) {
      setMessage(err.response?.data?.detail || 'Failed to generate codes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (generatedCodes.length === 0) return;
    window.localStorage.setItem('sc-generated-codes', JSON.stringify(generatedCodes));
  }, [generatedCodes]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Head>
        <title>Generate Codes | SecureCourse Pro Admin</title>
      </Head>
      <div className="flex min-h-screen">
        <Sidebar active="codes" />
        <div className="flex-1 px-4 py-6 md:px-8">
          <Navbar title="Generate Codes" />

          <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-lg shadow-slate-950/30">
              <h2 className="text-xl font-semibold">Create activation codes</h2>
              <p className="mt-2 text-sm text-slate-400">Generate secure activation codes for a course.</p>

              <form className="mt-6 space-y-5" onSubmit={handleGenerate}>
                <label className="block">
                  <span className="text-sm text-slate-300">Course ID</span>
                  <input
                    type="number"
                    required
                    min="1"
                    value={courseId}
                    onChange={(e) => setCourseId(e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-brand"
                    placeholder="Enter course ID"
                  />
                </label>
                <label className="block">
                  <span className="text-sm text-slate-300">Number of codes</span>
                  <input
                    type="number"
                    required
                    min="1"
                    value={count}
                    onChange={(e) => setCount(e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-brand"
                  />
                </label>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-2xl bg-brand px-4 py-3 text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? 'Generating…' : 'Generate Codes'}
                </button>
              </form>
              {message && <p className="mt-4 rounded-2xl bg-slate-800 px-4 py-3 text-sm text-slate-300">{message}</p>}
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-lg shadow-slate-950/30">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Generated codes</h2>
                  <p className="mt-1 text-sm text-slate-400">Codes are kept in your current session.</p>
                </div>
              </div>

              {generatedCodes.length === 0 ? (
                <div className="mt-8 rounded-3xl border border-dashed border-slate-700 p-8 text-center text-slate-500">Generate codes to see them here.</div>
              ) : (
                <div className="mt-6 space-y-3">
                  {generatedCodes.map((code, index) => (
                    <div key={`${code}-${index}`} className="rounded-2xl bg-slate-950/70 px-4 py-3 text-slate-100 shadow-sm shadow-slate-900/20">
                      {code}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
