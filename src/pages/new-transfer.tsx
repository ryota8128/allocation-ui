import Transfer from '@/types/Transfer';
import axios from 'axios';
import { GetServerSideProps, NextPage } from 'next';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Button } from 'reactstrap';
import { getSession } from 'next-auth/react';
import { findRegular } from '@/lib/regularReq';
import RegularTransferTable from '@/components/transfer/RegularTransferTable';
import { getAccountList } from '@/lib/accountReq';
import AccountList from './account/list';
import { useRouter } from 'next/router';

interface Props {
  regularList: RegularTransfer[];
  accountList: Account[];
}

const NewTransfer: NextPage<Props> = ({ regularList, accountList }) => {
  const [title, setTitle] = useState<string>('');
  const router = useRouter();

  const onChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const onClickConfirm = async () => {
    // 新規transfer追加処理
    const transfer: Transfer = { title: title };
    try {
      await axios.post('/api/transfer/insert', transfer);
      console.log('Success to insert Transfer');
    } catch (error) {
      console.log('Failed to insert Transfer');
      toast.error('新規振替追加に失敗しました');
    }

    // 追加したtransferを取得
    let insertedTransfer: Transfer;
    try {
      await axios.get(`api/transfer/findOneWithTitle?title=${title}`).then((res) => {
        insertedTransfer = res.data as Transfer;
        router.push(`/transfer?id=${insertedTransfer.id}`);
      });
    } catch (error) {
      console.log('Failed to findOne Transfer');
      router.push('/?error=invalidRequest');
      return;
    }
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <input
          style={{
            outline: 'none',
            padding: '5px',
            fontSize: '28px',
            fontWeight: 400,
            border: 'none',
            width: 400,
          }}
          value={title}
          onChange={onChangeTitle}
          placeholder="タイトルを入力してください"
        />
        <Button
          style={{ marginLeft: 50, whiteSpace: 'nowrap' }}
          color="primary"
          disabled={title === ''}
          outline={title === ''}
          onClick={onClickConfirm}
        >
          確定
        </Button>
      </div>
      <div style={{ marginTop: 30 }}>
        <h4>Regular Transfer</h4>
        <RegularTransferTable regularList={regularList} accountList={accountList} />
      </div>
    </>
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

  // regularList-find
  let regularList: RegularTransfer[];
  try {
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
    props: { regularList, accountList },
  };
};

export default NewTransfer;
