import { NextPage } from 'next';
import { Button, Table } from 'reactstrap';
import AccountDropdown from './table/dropdown/AccountDropdown';
import { CSSProperties, useState } from 'react';
import { deleteTemporary, insertTemporary, updateTemporary } from '@/lib/temporaryReq';
import Transfer from '@/types/Transfer';
import axios from 'axios';

const ownApiPath = process.env.NEXT_PUBLIC_OWN_API_PATH;

interface Props {
  temporaryList: TemporaryTransfer[];
  accountList: Account[];
  transfer: Transfer;
}

const TemporaryTransferTable: NextPage<Props> = ({ temporaryList, accountList, transfer }) => {
  const [defaultTemporaryList, setDefaultTemporaryList] = useState<TemporaryTransfer[]>(temporaryList);
  const [updatedTemporaryList, setUpdatedTemporaryList] = useState<TemporaryTransfer[]>(temporaryList);
  const [newTemporaryList, setNewTemporaryList] = useState<TemporaryTransfer[]>([]);
  const [newTemporaryKey, setNewTemporaryKey] = useState(-1);
  const [displayAccountList, setDisplayAccountList] = useState<Account[]>(accountList);

  const inputStyle: CSSProperties = {
    border: 'none',
    outline: 'none',
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>, changeId: number) => {
    const property = e.target.name as keyof TemporaryTransfer;

    // 表示してるtemporaryListを更新 and 変更のあるtemporaryをisChange:true
    setUpdatedTemporaryList(
      updatedTemporaryList.map((temp) => {
        if (temp.id !== changeId) {
          return temp;
        }

        const defaultTemp = defaultTemporaryList.find((t) => t.id === changeId) as TemporaryTransfer;

        const isChanged = e.target.value != defaultTemp[property];

        // 変更後の値をセット
        return {
          ...temp,
          [property]: e.target.value,
          isChanged: isChanged,
        };
      })
    );
  };

  const onBlur = (focusTemporary: TemporaryTransfer) => {
    if (focusTemporary.isChanged) {
      updateTemporary(focusTemporary);
      setDefaultTemporaryList([...updatedTemporaryList]);
      focusTemporary.isChanged = false;
    }
  };

  // dropdown内での変更を検知してupdateする
  const onClickDropdown = (
    id: number,
    newAccountId: number,
    newAccountName: string,
    column: 'fromAccount' | 'toAccount'
  ) => {
    let changedTemporary: TemporaryTransfer | undefined = undefined;
    setUpdatedTemporaryList(
      updatedTemporaryList.map((temp) => {
        if (temp.id !== id) return temp;

        changedTemporary = {
          ...temp,
          [column]: newAccountId,
          [`${column}Name`]: newAccountName,
        };
        return changedTemporary;
      })
    );
    if (changedTemporary) {
      updateTemporary(changedTemporary);
    }
  };

  // Temporary削除処理
  const onClickDeleteButton = (id: number) => {
    deleteTemporary(id);
    window.location.reload();
  };

  // 新規追加処理
  const onClickCreateTemporary = () => {
    setNewTemporaryList([...newTemporaryList, { id: newTemporaryKey, amount: 0, transferId: transfer.id as number }]);
    setNewTemporaryKey((pre) => pre - 1);
  };

  const onClickDropdownForNewTemporary = (
    id: number,
    newAccountId: number,
    newAccountName: string,
    column: 'fromAccount' | 'toAccount'
  ) => {
    let changedTemporary: TemporaryTransfer | undefined = undefined;
    setNewTemporaryList(
      newTemporaryList.map((temporary) => {
        if (temporary.id !== id) return temporary;

        changedTemporary = {
          ...temporary,
          [column]: newAccountId,
          [`${column}Name`]: newAccountName,
        };
        return changedTemporary;
      })
    );
  };

  const onChangeNewTemporary = (e: React.ChangeEvent<HTMLInputElement>, changeId: number) => {
    const property = e.target.name as keyof TemporaryTransfer;

    // 表示してるtemporaryListを更新 and 変更のあるtemporaryをisChange:true
    setNewTemporaryList(
      newTemporaryList.map((temporary) => {
        if (temporary.id !== changeId) {
          return temporary;
        }

        // 変更後の値をセット
        return {
          ...temporary,
          [property]: e.target.value,
        };
      })
    );
  };

  const onClickInsert = (temporary: TemporaryTransfer) => {
    const newTemporary: TemporaryTransfer = {
      fromAccount: temporary.fromAccount,
      toAccount: temporary.toAccount,
      description: temporary.description,
      amount: temporary.amount,
      transferId: temporary.transferId,
    };

    axios
      .post(`${ownApiPath}/api/temporary/insert`, newTemporary)
      .then((res) => {
        console.log(res);
        console.log('Temporary Transferの追加に成功しました．');
        const insertedTemporary: TemporaryTransfer = res.data as TemporaryTransfer;
        setUpdatedTemporaryList([...updatedTemporaryList, insertedTemporary]);
        setNewTemporaryList(newTemporaryList.filter((r) => r.id !== temporary.id));
      })
      .catch((err) => {
        console.warn(err.response);
        // setErrMsg(err.response.data);
      });
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
      <div>
        <Table style={{ width: '730px', zIndex: 1, position: 'relative' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'center' }}>from</th>
              <th style={{ textAlign: 'center' }}>to</th>
              <th style={{ textAlign: 'center' }}>description</th>
              <th style={{ textAlign: 'center' }}>amount</th>
            </tr>
          </thead>
          <tbody>
            {updatedTemporaryList.map((temporary) => (
              <tr key={temporary.id}>
                <td>
                  <AccountDropdown
                    accountList={displayAccountList}
                    transfer={temporary}
                    column="fromAccount"
                    onClickDropdown={onClickDropdown}
                    setDisplayAccountList={setDisplayAccountList}
                  />
                </td>
                <td>
                  <AccountDropdown
                    accountList={displayAccountList}
                    transfer={temporary}
                    column="toAccount"
                    onClickDropdown={onClickDropdown}
                    setDisplayAccountList={setDisplayAccountList}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    style={{ ...inputStyle, width: 150, textAlign: 'right' }}
                    name="description"
                    value={temporary.description ?? ''}
                    onChange={(e) => onChange(e, temporary.id as number)}
                    onBlur={() => onBlur(temporary)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    style={{ ...inputStyle, width: 100, fontFamily: 'Lining', textAlign: 'right' }}
                    name="amount"
                    value={temporary.amount}
                    onChange={(e) => onChange(e, temporary.id as number)}
                    onBlur={() => onBlur(temporary)}
                  />
                </td>
                <td>
                  <Button
                    outline
                    className="btn-sm"
                    color="danger"
                    onClick={() => onClickDeleteButton(temporary.id as number)}
                  >
                    削除
                  </Button>
                </td>
              </tr>
            ))}

            {/* 新規追加前のTemporaryTransferリスト */}
            {newTemporaryList.map((temp) => (
              <tr key={temp.id}>
                <td>
                  <AccountDropdown
                    accountList={displayAccountList}
                    transfer={temp}
                    column="fromAccount"
                    onClickDropdown={onClickDropdownForNewTemporary}
                    setDisplayAccountList={setDisplayAccountList}
                  />
                </td>
                <td>
                  <AccountDropdown
                    accountList={displayAccountList}
                    transfer={temp}
                    column="toAccount"
                    onClickDropdown={onClickDropdownForNewTemporary}
                    setDisplayAccountList={setDisplayAccountList}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    style={{ ...inputStyle, width: 150, textAlign: 'right' }}
                    name="description"
                    value={temp.description ?? ''}
                    onChange={(e) => onChangeNewTemporary(e, temp.id as number)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="amount"
                    style={{
                      ...inputStyle,
                      width: 100,
                      textAlign: 'right',
                      fontFamily: 'Lining',
                    }}
                    value={temp.amount}
                    onChange={(e) => onChangeNewTemporary(e, temp.id as number)}
                  />
                </td>
                <td>
                  <Button outline className="btn-sm" color="primary" onClick={() => onClickInsert(temp)}>
                    追加
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <Button className="btn-sm" onClick={onClickCreateTemporary}>
        新規追加
      </Button>
    </div>
  );
};

export default TemporaryTransferTable;
