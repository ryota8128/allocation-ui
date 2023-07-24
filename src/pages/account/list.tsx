import TableAccountList from '@/components/account/TableAccountList';
import { getAccount } from '@/lib/accountReq';
import axios from 'axios';
import { GetServerSideProps, NextPage } from 'next';
import { getSession, useSession } from 'next-auth/react';

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

  const accountList: Account[] = await getAccount(token);
  return {
    props: { accountList },
  };
};

interface Props {
  accountList: Account[];
}

const List: NextPage<Props> = ({ accountList }) => {
  return (
    <div>
      <TableAccountList accountList={accountList} />
    </div>
  );
};

export default List;
