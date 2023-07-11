import { LinkButton } from '@/components/common/LinkButton';
import { useSession } from 'next-auth/react';

export default function Home() {
  const { data: session, status } = useSession();

  return (
    <>
      <main style={{ marginTop: 100 }}>
        <LinkButton href="/account/add" text="アカウント追加" />
        <LinkButton href="/login" text="ログイン" />
        <LinkButton href="/account/list" text="口座一覧" />
        <p>{session?.user.name}</p>
        <p>{session?.accessToken}</p>
      </main>
    </>
  );
}
