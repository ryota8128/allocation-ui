import Layout from '@/components/Layout';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import toast, { Toaster } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function App({ Component, pageProps }: AppProps) {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // URLクエリパラメータから'error'を取得
    const { error } = router.query;
    if (error === 'invalidForm') {
      toast.error('未入力の項目があります');
    } else if (error === 'failed') {
      toast.error('ユーザー名または，パスワードが間違っています');
    } else if (error === 'unauthorize') {
      toast.error('アクセス権限がありません');
    } else if (error === 'invalidRequest') {
      const timer = setTimeout(() => {
        toast.error('不正なリクエストです');
      }, 50);
      router.replace(router.pathname);
      return () => clearTimeout(timer);
    }

    if (error) {
      router.replace(router.pathname);
    }
  }, [router.query]);

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
