import { useEffect, useState } from 'react';
import Head from 'next/head';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import api from '../services/api';

export default function VideosPage() {
  const [courseId, setCourseId] = useState('');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [duration, setDuration] = useState(0);
  const [order, setOrder] = useState(1);
  const [videos, setVideos] = useState([]);
  const [loadingVideos, setLoadingVideos] = useState(false);
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState('');

  const fetchVideos = async () => {
    if (!courseId) {
      setVideos([]);
      return;
    }
    setLoadingVideos(true);
    try {
      const response = await api.get(`/videos/course/${courseId}`);
      setVideos(response.data || []);
    } catch (err) {
      setMessage(err.response?.data?.detail || 'Unable to load videos.');
    } finally {
      setLoadingVideos(false);
    }
  };

  useEffect(() => {
    if (courseId) {
      fetchVideos();
    }
  }, [courseId]);

  const handleCreate = async (event) => {
    event.preventDefault();
    setCreating(true);
    setMessage('');
    try {
      await api.post('/admin/videos', {
        course_id: Number(courseId),
        title,
        url,
        duration: Number(duration),
        order: Number(order),
      });
      setTitle('');
      setUrl('');
      setDuration(0);
      setOrder(order + 1);
      await fetchVideos();
      setMessage('Video created successfully.');
    } catch (err) {
      setMessage(err.response?.data?.detail || 'Video creation failed.');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Head>
        <title>Videos | SecureCourse Pro Admin</title>
      </Head>
      <div className="flex min-h-screen">
        <Sidebar active="videos" />
        <div className="flex-1 px-4 py-6 md:px-8">
          <Navbar title="Videos" />

          <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-lg shadow-slate-950/30">
              <h2 className="text-xl font-semibold">Add video</h2>
              <p className="mt-2 text-sm text-slate-400">Upload video information for a course.</p>

              <form className="mt-6 space-y-5" onSubmit={handleCreate}>
                <label className="block">
                  <span className="text-sm text-slate-300">Course ID</span>
                  <input
                    type="number"
                    required
                    min="1"
                    value={courseId}
                    onChange={(e) => setCourseId(e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-brand"
                    placeholder="Course ID"
                  />
                </label>
                <label className="block">
                  <span className="text-sm text-slate-300">Video title</span>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-brand"
                    placeholder="Lecture title"
                  />
                </label>
                <label className="block">
                  <span className="text-sm text-slate-300">Video URL</span>
                  <input
                    type="url"
                    required
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-brand"
                    placeholder="https://example.com/video.mp4"
                  />
                </label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-sm text-slate-300">Duration (sec)</span>
                    <input
                      type="number"
                      required
                      min="0"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-brand"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm text-slate-300">Order</span>
                    <input
                      type="number"
                      required
                      min="1"
                      value={order}
                      onChange={(e) => setOrder(e.target.value)}
                      className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-brand"
                    />
                  </label>
                </div>
                <button
                  type="submit"
                  disabled={creating}
                  className="w-full rounded-2xl bg-brand px-4 py-3 text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {creating ? 'Saving…' : 'Save Video'}
                </button>
              </form>
              {message && <p className="mt-4 rounded-2xl bg-slate-800 px-4 py-3 text-sm text-slate-300">{message}</p>}
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-lg shadow-slate-950/30">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Course videos</h2>
                  <p className="mt-1 text-sm text-slate-400">Load all videos for the selected course.</p>
                </div>
                <button
                  onClick={fetchVideos}
                  className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-slate-200 transition hover:border-brand"
                >
                  Refresh
                </button>
              </div>

              {loadingVideos ? (
                <div className="mt-8 rounded-3xl border border-dashed border-slate-700 p-8 text-center text-slate-500">Loading videos…</div>
              ) : videos.length === 0 ? (
                <div className="mt-8 rounded-3xl border border-dashed border-slate-700 p-8 text-center text-slate-500">No videos found for this course.</div>
              ) : (
                <div className="mt-6 space-y-4">
                  {videos.map((video) => (
                    <div key={video.id} className="rounded-3xl border border-slate-800 bg-slate-950 px-5 py-4">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-semibold text-white">{video.title}</h3>
                          <p className="mt-1 text-sm text-slate-400">ID: {video.id}</p>
                        </div>
                        <span className="rounded-full bg-slate-800 px-3 py-1 text-xs uppercase tracking-[0.12em] text-slate-400">Order {video.order}</span>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2 text-sm text-slate-400">
                        <span>Duration: {video.duration}s</span>
                        <span className="truncate">{video.url}</span>
                      </div>
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
