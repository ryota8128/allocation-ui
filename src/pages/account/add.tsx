import FormAddAccount from '@/components/account/FormAddAccount';
import { NextPage } from 'next';

interface Props {}

const Add: NextPage<Props> = () => {
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
};

export default Add;
