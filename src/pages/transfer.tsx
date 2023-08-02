import RegularTransferTable from '@/components/transfer/RegularTransferTable';
import TemporaryTransferTable from '@/components/transfer/TemporaryTransferTable';
import { getAccountList } from '@/lib/accountReq';
import optimize from '@/lib/optimize';
import { findRegular, findRegularWithApi } from '@/lib/regularReq';
import { findTemporary, findTemporaryWithApi } from '@/lib/temporaryReq';
import { findOneTransfer } from '@/lib/transferReq';
import Transfer from '@/types/Transfer';
import { NextPage, GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { useState } from 'react';
import { Alert, Button } from 'reactstrap';

interface Props {
  temporaryList: TemporaryTransfer[];
  regularList: RegularTransfer[];
  transfer: Transfer;
  accountList: Account[];
}

const TransferPage: NextPage<Props> = ({ temporaryList, regularList, transfer, accountList }) => {
  const [errMsg, setErrMsg] = useState<string>('');
  const onClickOptimize = async () => {
    try {
      const updateRegularList = await findRegularWithApi();
      const updateTemporaryList = await findTemporaryWithApi(transfer.id as number);
      optimize(updateRegularList, updateTemporaryList);
    } catch (error) {
      if (error instanceof Error) {
        setErrMsg(error.message);
      }
    }
  };

  return (
    <div>
      {errMsg !== '' && <Alert color="danger">{errMsg}</Alert>}
      <h1>{transfer.title}</h1>

      <h4>Regular Transfer</h4>
      <RegularTransferTable regularList={regularList} accountList={accountList} />
      <h4 style={{ marginTop: 30 }}>Temporary Transfer</h4>
      <TemporaryTransferTable
        accountList={accountList}
        temporaryList={temporaryList}
        transfer={transfer}
      />
      <div>
        <Button
          style={{
            marginTop: 40,
            width: 130,
            height: 60,
            position: 'absolute',
            left: '40%',
            fontSize: 22,
          }}
          color="primary"
          onClick={onClickOptimize}
        >
          optimize
        </Button>
      </div>
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
    temporaryList = (await findTemporary(token, transferId)) as TemporaryTransfer[];
    regularList = (await findRegular(token)) as unknown as RegularTransfer[];
  } catch (error) {
    return {
      redirect: {
        destination: '/?error=invalidRequest',
        permanent: false,
      },
    };
  }

  // account-find
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
    props: {
      temporaryList,
      regularList,
      transfer,
      accountList,
    },
  };
};

export default TransferPage;
