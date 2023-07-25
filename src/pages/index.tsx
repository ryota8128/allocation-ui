import AppTitle from '@/components/home/AppTitle';
import Item from '@/components/home/Item';
import { isTokenExpired } from '@/lib/ JwtUtils';
import { isTokenExpired } from '@/lib/ JwtUtils';
import { getTransfers } from '@/lib/transferReq';
import Transfer from '@/types/Transfer';
import { GetServerSideProps, NextPage } from 'next';
import { getSession, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface Props {
  transferList: Transfer[];
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  const token = session?.accessToken;
  if (!token) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  if (isTokenExpired(token)) {
    return {
      redirect: {
        destination: '/login?error=session-expired',
        permanent: false,
      },
    };
  }

  let transferList: Transfer[];
  try {
    transferList = await getTransfers(token);
  } catch (error) {
    return {
      redirect: {
        destination: '/login?error=session-expired',
        permanent: false,
      },
    };
  }

  return {
    props: { transferList },
  };
};

const Index: NextPage<Props> = ({ transferList }) => {
  const [showToast, setShowToast] = useState<boolean>(true);
  const { data: session, status } = useSession();
  const router = useRouter();
  const { login } = router.query;

  useEffect(() => {
    if (login === 'success' && showToast) {
      setShowToast(false);
    }
  }, [login]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!showToast) {
        toast.success('ログインしました');
        router.replace(router.pathname); // クエリパラメータを削除する
      }
    }, 50);

    return () => clearTimeout(timer); // コンポーネントがアンマウントされる際にタイマーをクリアする
  }, [showToast]);

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
        <div className="container">
          <AppTitle>Money Allocation App</AppTitle>
          <Item href="/new-transfer">新規振替</Item>
          {transferList.map((transfer) => (
            <Item key={transfer.id} href={`/transfer?id=${transfer.id}`}>
              {transfer.title}
            </Item>
          ))}
        </div>
      </>
    );
  }
};

export default Index;
