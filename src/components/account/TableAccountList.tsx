import { addAccountWithApi, deleteAccountWithApi, updateAccountWithApi } from '@/lib/accountReq';
import { NextPage } from 'next';
import { CSSProperties, useEffect, useRef, useState } from 'react';
import { Button, Table } from 'reactstrap';
import AccountDropdownInAccountList from './AccountDropdownInAccountList';
import SelectViaWhenAddAccount from './SelectViaWhenAddAccount';

interface Props {
  accountList: Account[];
}

const TableAccountList: NextPage<Props> = ({ accountList }) => {
  const [defaultAccountList, setDefaultAccountList] = useState<Account[]>(accountList);
  const [updatedAccountList, setUpdatedAccountList] = useState<Account[]>(accountList);
  const [addNewAccountBool, setAddNewAccountBool] = useState<boolean>(false);
  const [newAccount, setNewAccount] = useState<Account>({
    name: '',
    numFreeTransfer: 0,
    transferFee: 100,
  });
  const newAccountNameInputRef = useRef<HTMLInputElement>(null);

  const onChangeAccount = (accountId: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const property = e.target.name as keyof Account;

    // 表示項目の変更
    setUpdatedAccountList((prevAccountList) =>
      prevAccountList.map((ac) => {
        if (ac.id !== accountId) {
          return ac;
        }

        // 更新前と比較して変更があるか
        const defaultAcc = defaultAccountList.find((acc) => acc.id === accountId) as Account;
        const isChanged = e.target.value != defaultAcc[property];

        //　変更後の値をセット
        return {
          ...ac,
          [property]: e.target.value,
          isChanged: isChanged,
        };
      })
    );
  };

  // inputのフォーカスが外れた時に変更があれば更新
  const onBlurUpdate = (focusAccount: Account) => {
    if (focusAccount.isChanged) {
      try {
        updateAccountWithApi(focusAccount);
        setDefaultAccountList([...updatedAccountList]);
        focusAccount.isChanged = false;
        console.log('Success to update Account');
      } catch (error) {
        console.log('Failed to update Account');
      }
    }
  };

  // 削除ボタン
  const onClickDeleteAccount = async (id: number) => {
    try {
      await deleteAccountWithApi(id);
      console.log('Success to delete Account');
      setDefaultAccountList(defaultAccountList.filter((a) => a.id !== id));
      setUpdatedAccountList(updatedAccountList.filter((a) => a.id !== id));
    } catch (error) {
      console.log('Failed to delete Account');
    }
  };

  // 新規Account追加処理
  const onClickInsertForm = () => {
    setAddNewAccountBool(true);
  };

  // 新規追加ボタンを押した時inputにfocus
  useEffect(() => {
    if (addNewAccountBool && newAccountNameInputRef.current) {
      newAccountNameInputRef.current.focus();
    }
  }, [addNewAccountBool]);

  // 新規Accountの変更反映
  const onChangeNewAccountForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    const property = e.target.name as keyof Account;
    setNewAccount((prev) => ({
      ...prev,
      [property]: e.target.value,
    }));
  };

  //Account新規追加処理
  const onClickInsertAccount = async () => {
    try {
      await addAccountWithApi(newAccount);
      window.location.reload();
      console.log('Success to insert Account');
    } catch (error) {
      console.log('Failed to insert Account');
    }
  };

  const inputStyle: CSSProperties = {
    border: 'none',
    outline: 'none',
  };

  return (
    <div>
      <style jsx>{`
        /* 削除ボタンがはみ出すようにする */
        td:last-child {
          white-space: nowrap;
          border: none;
        }
      `}</style>
      <Table>
        <thead>
          <tr style={{ whiteSpace: 'nowrap' }}>
            <th style={{ textAlign: 'center' }}>口座名</th>
            <th style={{ textAlign: 'center' }}>無料振込回数</th>
            <th style={{ textAlign: 'center' }}>振込手数料</th>
            <th style={{ textAlign: 'center' }}>経由口座</th>
          </tr>
        </thead>
        <tbody>
          {updatedAccountList.map((account) => (
            <tr key={account.id}>
              <td>
                <input
                  type="text"
                  value={account.name}
                  name="name"
                  onChange={(e) => onChangeAccount(account.id as number, e)}
                  onBlur={() => onBlurUpdate(account)}
                  style={{ ...inputStyle, width: 140, textAlign: 'center' }}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={account.numFreeTransfer}
                  name="numFreeTransfer"
                  onChange={(e) => onChangeAccount(account.id as number, e)}
                  onBlur={() => onBlurUpdate(account)}
                  style={{ ...inputStyle, width: 100, textAlign: 'center' }}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={account.transferFee}
                  name="transferFee"
                  onChange={(e) => onChangeAccount(account.id as number, e)}
                  onBlur={() => onBlurUpdate(account)}
                  style={{ ...inputStyle, width: 100, textAlign: 'center' }}
                />
              </td>
              <td>
                <AccountDropdownInAccountList accountList={accountList} account={account} />
              </td>
              <td>
                <Button
                  outline
                  className="btn-sm"
                  color="danger"
                  onClick={() => onClickDeleteAccount(account.id as number)}
                >
                  削除
                </Button>
              </td>
            </tr>
          ))}

          {addNewAccountBool && (
            <>
              <tr>
                <td>
                  <input
                    type="text"
                    name="name"
                    value={newAccount.name}
                    onChange={onChangeNewAccountForm}
                    style={{ ...inputStyle, width: 140, textAlign: 'center' }}
                    ref={newAccountNameInputRef}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="numFreeTransfer"
                    value={newAccount.numFreeTransfer}
                    onChange={onChangeNewAccountForm}
                    style={{ ...inputStyle, width: 100, textAlign: 'center' }}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="transferFee"
                    value={newAccount.transferFee}
                    onChange={onChangeNewAccountForm}
                    style={{ ...inputStyle, width: 100, textAlign: 'center' }}
                  />
                </td>
                <td>
                  <SelectViaWhenAddAccount
                    accountList={accountList}
                    account={newAccount}
                    setNewAccount={setNewAccount}
                  />
                </td>
                <td>
                  <Button outline className="btn-sm" color="primary" onClick={onClickInsertAccount}>
                    追加
                  </Button>
                </td>
              </tr>
            </>
          )}
        </tbody>
      </Table>
      <Button className="btn-sm" onClick={onClickInsertForm}>
        新規追加
      </Button>
    </div>
  );
};

export default TableAccountList;
