import { LinkButton } from '@/components/common/LinkButton';
import { log } from 'console';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { login } = router.query;

  useEffect(() => {
    if (login === 'success') {
      toast.success('ログイン成功');
      router.replace(router.pathname); // クエリパラメータを削除する
    }
  }, [login]);

  if (status === 'loading') {
    return (
      <>
        <p>Hang on there...</p>
      </>
    );
  }

  if (status === 'authenticated') {
    return (
      <>
        <main style={{ marginTop: 100 }}>
          <LinkButton href="/login" text="ログイン" />
          <LinkButton href="/account/list" text="口座一覧" />
          <LinkButton href="/account/add" text="口座追加" />
        </main>
      </>
    );
  }

  router.push('/login');
}
