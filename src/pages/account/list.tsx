import TableAccountList from '@/components/account/TableAccountList';
import { getAccountList } from '@/lib/accountReq';
import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';

interface Props {
  accountList: Account[];
}

const AccountList: NextPage<Props> = ({ accountList }) => {
  return (
    <div>
      <h4>口座情報</h4>
      <TableAccountList accountList={accountList} />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  const token = session?.accessToken;

  // 未ログイン時のエラー
  if (!token) {
    return {
      redirect: {
        destination: '/login?error=unauthorize',
        permanent: false,
      },
    };
  }

  let accountList: Account[];
  try {
    accountList = await getAccountList(token);
  } catch (error) {
    return {
      redirect: {
        destination: '/?error=invalidRequest',
        permanent: false,
      },
    };
  }

  return {
    props: { accountList },
  };
};

export default AccountList;
