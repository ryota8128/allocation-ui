import { NextPage } from 'next';
import { CSSProperties } from 'react';
import { Button } from 'reactstrap';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';

interface Props {}

const Logout: NextPage<Props> = () => {
  const router = useRouter();

  const onClickLogout: React.MouseEventHandler<HTMLButtonElement> = () => {
    signOut({ callbackUrl: '/login?logout=success' });
  };

  return (
    <>
      <style jsx>{`
        .flex-container {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
      `}</style>

      <div className="flex-container">
        <h3>ログアウトしてよろしいですか?</h3>
        <div style={{ marginTop: 50 }}>
          <Button style={{ marginRight: 240 }} onClick={() => router.back()}>
            戻る
          </Button>
          <Button color="primary" onClick={onClickLogout}>
            ログアウト
          </Button>
        </div>
      </div>
    </>
  );
};

export default Logout;
