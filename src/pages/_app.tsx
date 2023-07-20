import Layout from '@/components/Layout';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'react-hot-toast';
import { useEffect, useState } from 'react';

export default function App({ Component, pageProps }: AppProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      <SessionProvider session={pageProps.session}>
        <Layout>
          {isMounted && <Toaster />}
          <Component {...pageProps} />
        </Layout>
      </SessionProvider>
    </>
  );
}
