import { useEffect, useState } from 'react';
import Head from 'next/head';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import api from '../services/api';

export default function CoursesPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState('');

  const loadCourses = async () => {
    setLoading(true);
    try {
      const response = await api.get('/courses/');
      setCourses(response.data || []);
    } catch (err) {
      setMessage(err.response?.data?.detail || 'Unable to load courses.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setCreating(true);
    setMessage('');
    try {
      await api.post('/admin/courses', { title, description, price: Number(price) });
      setTitle('');
      setDescription('');
      setPrice(0);
      await loadCourses();
      setMessage('Course created successfully.');
    } catch (err) {
      setMessage(err.response?.data?.detail || 'Course creation failed.');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Head>
        <title>Courses | SecureCourse Pro Admin</title>
      </Head>
      <div className="flex min-h-screen">
        <Sidebar active="courses" />
        <div className="flex-1 px-4 py-6 md:px-8">
          <Navbar title="Courses" />

          <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-lg shadow-slate-950/30">
              <h2 className="text-xl font-semibold">Create course</h2>
              <p className="mt-2 text-sm text-slate-400">Add a new course to the platform.</p>

              <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
                <label className="block">
                  <span className="text-sm text-slate-300">Title</span>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-brand"
                    placeholder="Course name"
                  />
                </label>
                <label className="block">
                  <span className="text-sm text-slate-300">Description</span>
                  <textarea
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-brand"
                    rows="4"
                    placeholder="Course description"
                  />
                </label>
                <label className="block">
                  <span className="text-sm text-slate-300">Price</span>
                  <input
                    type="number"
                    required
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-brand"
                    placeholder="Price in cents"
                  />
                </label>
                <button
                  type="submit"
                  disabled={creating}
                  className="w-full rounded-2xl bg-brand px-4 py-3 text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {creating ? 'Creating…' : 'Create Course'}
                </button>
              </form>
              {message && <p className="mt-4 rounded-2xl bg-slate-800 px-4 py-3 text-sm text-slate-300">{message}</p>}
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-lg shadow-slate-950/30">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Course list</h2>
                  <p className="mt-1 text-sm text-slate-400">Courses accessible by this admin session.</p>
                </div>
                <button
                  onClick={loadCourses}
                  className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-slate-200 transition hover:border-brand"
                >
                  Refresh
                </button>
              </div>

              {loading ? (
                <div className="mt-8 rounded-3xl border border-dashed border-slate-700 p-8 text-center text-slate-500">Loading courses…</div>
              ) : courses.length === 0 ? (
                <div className="mt-8 rounded-3xl border border-dashed border-slate-700 p-8 text-center text-slate-500">No courses found.</div>
              ) : (
                <div className="mt-6 space-y-4">
                  {courses.map((course) => (
                    <div key={course.id} className="rounded-3xl border border-slate-800 bg-slate-950 px-5 py-4">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-semibold text-white">{course.title}</h3>
                          <p className="mt-1 text-sm text-slate-400">ID: {course.id}</p>
                        </div>
                        <span className="rounded-full bg-slate-800 px-3 py-1 text-xs uppercase tracking-[0.12em] text-slate-400">{course.videos_count ?? 0} videos</span>
                      </div>
                      <p className="mt-3 text-sm text-slate-300">{course.description || 'No description'}</p>
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
