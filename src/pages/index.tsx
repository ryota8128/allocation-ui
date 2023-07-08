import { LinkButton } from '@/components/common/LinkButton';


export default function Home() {
  return (
    <>
      <main style={{ marginTop: 100 }}>
        <LinkButton href='/account/add' text='アカウント追加' />
        <LinkButton href='/login' text='ログイン' />
        <LinkButton href='/accountList' text='口座一覧' />
      </main>
    </>
  );
}
