import FormAddAccount from '@/components/account/FormAddAccount';

export default function Home() {
  return (
    <>
      <main>
          <h4 style={{ marginBottom: 20, textAlign: 'center' }}>
            追加する講座情報を入力してください
          </h4>
          <FormAddAccount />
      </main>
    </>
  );
}
