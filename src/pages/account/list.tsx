import TableAccountList from '@/components/account/TableAccountLIst';
import Account from '@/types/Account';
import axios from 'axios';
import { GetServerSideProps, NextPage } from 'next';
import { getSession, useSession } from 'next-auth/react';
import { headers } from 'next/dist/client/components/headers';
import { Table } from 'reactstrap';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  const token = session?.accessToken;
  const res = await axios.get('http://localhost:8080/api/account/list', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const accountList: Account[] = res.data;
  console.log(accountList);

  return {
    props: { accountList },
  };
};

interface Props {
  accountList: Account[];
}

const list: NextPage<Props> = ({ accountList }) => {
  return (
    <div>
      <TableAccountList accountList={accountList} />
    </div>
  );
};

export default list;
