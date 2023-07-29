import { NextPage } from 'next';
import { Button, Table } from 'reactstrap';
import AccountDropdown from './table/AccountDropdown';
import { CSSProperties, useState } from 'react';
import { deleteTemporary, insertTemporary, updateTemporary } from '@/lib/temporaryReq';
import Transfer from '@/types/Transfer';

interface Props {
  temporaryList: TemporaryTransfer[];
  accountList: Account[];
  transfer: Transfer;
}

const TemporaryTransferTable: NextPage<Props> = ({ temporaryList, accountList, transfer }) => {
  const [defaultTemporaryList, setDefaultTemporaryList] =
    useState<TemporaryTransfer[]>(temporaryList);
  const [updatedTemporaryList, setUpdatedTemporaryList] =
    useState<TemporaryTransfer[]>(temporaryList);

  const inputStyle: CSSProperties = {
    border: 'none',
    outline: 'none',
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>, changeId: number) => {
    const property = e.target.name as keyof TemporaryTransfer;

    // 表示してるtemporaryListを更新 and 変更のあるregularをisChange:true
    setUpdatedTemporaryList(
      updatedTemporaryList.map((temp) => {
        if (temp.id !== changeId) {
          return temp;
        }

        const defaultTemp = defaultTemporaryList.find(
          (t) => t.id === changeId
        ) as TemporaryTransfer;

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

  // 新規追加処理
  const onClickInsert = () => {
    insertTemporary(transfer.id);
    window.location.reload();
  };

  // Temporary削除処理
  const onClickDeleteButton = (id: number) => {
    deleteTemporary(id);
    window.location.reload();
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
          <tr>
            <th>from</th>
            <th>to</th>
            <th>description</th>
            <th>amount</th>
          </tr>
        </thead>
        <tbody>
          {updatedTemporaryList.map((temporary) => (
            <tr key={temporary.id}>
              <td>
                <AccountDropdown
                  accountList={accountList}
                  transfer={temporary}
                  column="fromAccount"
                  onClickDropdown={onClickDropdown}
                />
              </td>
              <td>
                <AccountDropdown
                  accountList={accountList}
                  transfer={temporary}
                  column="toAccount"
                  onClickDropdown={onClickDropdown}
                />
              </td>
              <td>
                <input
                  type="text"
                  style={{ ...inputStyle, width: 150 }}
                  name="description"
                  value={temporary.description ?? ''}
                  onChange={(e) => onChange(e, temporary.id as number)}
                  onBlur={() => onBlur(temporary)}
                />
              </td>
              <td>
                <input
                  type="number"
                  style={{ ...inputStyle, width: 100 }}
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
        </tbody>
      </Table>
      <Button className="btn-sm" onClick={onClickInsert}>
        新規追加
      </Button>
    </div>
  );
};

export default TemporaryTransferTable;
