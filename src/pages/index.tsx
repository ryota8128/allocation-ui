import AppTitle from '@/components/home/AppTitle';
import Item from '@/components/home/Item';
import { getTransfers } from '@/lib/transferReq';
import Transfer from '@/types/Transfer';
import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';

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
  const transferList: Transfer[] = await getTransfers(token);

  // const transferList = [{ id: 1, title: '202306', userId: 2 }];
  return {
    props: { transferList },
  };
};

const Index: NextPage<Props> = ({ transferList }) => {
  return (
    <>
      <div className="container">
        <AppTitle>Money Allocation App</AppTitle>
        <Item href="/new-transfer">新規振替</Item>
        {transferList.map((transfer) => (
          <>
            <Item key={transfer.id} href={`/transfer/[${transfer.id}]`}>
              {transfer.title}
            </Item>
          </>
        ))}
      </div>
    </>
  );
};

export default Index;
