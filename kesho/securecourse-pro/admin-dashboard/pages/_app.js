import '../styles/globals.css';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const publicPaths = ['/login'];

export default function App({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const token = window.localStorage.getItem('sc-admin-token');
    if (!token && !publicPaths.includes(router.pathname)) {
      router.replace('/login');
    }
  }, [router.pathname]);

  return <Component {...pageProps} />;
}
