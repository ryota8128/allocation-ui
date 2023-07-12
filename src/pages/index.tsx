import { LinkButton } from '@/components/common/LinkButton';

export default function Home() {
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
