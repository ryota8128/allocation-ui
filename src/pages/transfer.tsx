import RegularTransferTable from '@/components/transfer/RegularTransferTable';
import TemporaryTransferTable from '@/components/transfer/TemporaryTransferTable';
import { findRegular } from '@/lib/regularReq';
import { findTemporary } from '@/lib/temporaryReq';
import { findOneTransfer } from '@/lib/transferReq';
import Transfer from '@/types/Transfer';
import { NextPage, GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { Table } from 'reactstrap';

interface Props {
  temporaryList: TemporaryTransfer[];
  regularList: RegularTransfer[];
  transfer: Transfer;
}

const TransferPage: NextPage<Props> = ({
  temporaryList,
  regularList,
  transfer,
}) => {
  return (
    <div>
      <h1>{transfer.title}</h1>

      <h4>Regular Transfer</h4>
      <RegularTransferTable regularList={regularList} />
      <h4>Temporary Transfer</h4>
      <TemporaryTransferTable temporaryList={temporaryList} />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  const transferId = context.query?.id as unknown as number;
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

  //パラメータなしのエラー
  if (!transferId) {
    return {
      redirect: {
        destination: '/?error=invalidRequest',
        permanent: false,
      },
    };
  }

  //transfer-findOne
  let transfer: Transfer;
  try {
    transfer = await findOneTransfer(token, transferId);
  } catch (error) {
    return {
      redirect: {
        destination: '/?error=invalidRequest',
        permanent: false,
      },
    };
  }

  //temporary-find, regular-find
  let temporaryList: TemporaryTransfer[];
  let regularList: RegularTransfer[];
  try {
    temporaryList = await findTemporary(token);
    regularList = await findRegular(token);
  } catch (error) {
    return {
      redirect: {
        destination: '/?error=invalidRequest',
        permanent: false,
      },
    };
  }

  return {
    props: {
      temporaryList,
      regularList,
      transfer,
    },
  };
};

export default TransferPage;
