import TableAccountList from '@/components/account/TableAccountList';
import RegularTransferTable from '@/components/transfer/RegularTransferTable';
import TemplateTransferTable from '@/components/transfer/TemplateTransferTable';
import { getAccountList } from '@/lib/accountReq';
import axios from 'axios';
import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';
import { useState } from 'react';
import { Alert, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

interface Props {
  accountList: Account[];
  templateList: TemplateTransfer[];
  regularList: RegularTransfer[];
}

const AccountList: NextPage<Props> = ({ accountList, templateList, regularList }) => {
  const [tabNo, setTabNo] = useState('1');
  const [errMsg, setErrMsg] = useState('');

  return (
    <div>
      {errMsg !== '' && <Alert color="danger">{errMsg}</Alert>}
      <Nav tabs>
        <NavItem>
          <NavLink className={tabNo === '1' ? 'active' : ''} onClick={() => setTabNo('1')}>
            口座情報
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink className={tabNo === '2' ? 'active' : ''} onClick={() => setTabNo('2')}>
            固定振替
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink className={tabNo === '3' ? 'active' : ''} onClick={() => setTabNo('3')}>
            準固定振替
          </NavLink>
        </NavItem>
      </Nav>

      <TabContent activeTab={tabNo}>
        <TabPane tabId="1">
          <h4 style={{ marginTop: 30 }}>口座情報</h4>
          <TableAccountList accountList={accountList} />
        </TabPane>
        <TabPane tabId="2">
          <h4 style={{ marginTop: 30 }}>Regular Transfer</h4>
          <RegularTransferTable regularList={regularList} accountList={accountList} />
        </TabPane>
        <TabPane tabId="3">
          <h4 style={{ marginTop: 30 }}>Template Transfer</h4>
          <TemplateTransferTable
            templateList={templateList}
            accountList={accountList}
            setErrMsg={setErrMsg}
          />
        </TabPane>
      </TabContent>
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

  // Account一覧の取得
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

  // TemplateTransfer一覧の取得
  let templateList: TemplateTransfer[];
  try {
    const res = await axios.get(`${apiUrl}/api/template/list`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    templateList = res.data as TemplateTransfer[];
  } catch (error) {
    return {
      redirect: {
        destination: '/login?error=unauthorize',
        permanent: false,
      },
    };
  }

  // RegularTransfer一覧の取得
  let regularList: RegularTransfer[];
  try {
    const res = await axios.get(`${apiUrl}/api/regular/list`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    regularList = res.data as RegularTransfer[];
  } catch (error) {
    return {
      redirect: {
        destination: '/login?error=unauthorize',
        permanent: false,
      },
    };
  }

  return {
    props: { accountList, templateList, regularList },
  };
};

export default AccountList;
