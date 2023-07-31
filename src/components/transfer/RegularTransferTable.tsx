import { NextPage } from 'next';
import { Button, Table } from 'reactstrap';
import AccountDropdown from './table/dropdown/AccountDropdown';
import { CSSProperties, useState } from 'react';
import { deleteRegular, insertRegular, updateRegular } from '@/lib/regularReq';

interface Props {
  regularList: RegularTransfer[];
  accountList: Account[];
}

const RegularTransferTable: NextPage<Props> = ({ regularList, accountList }) => {
  const [defaultRegularList, setDefaultRegularList] = useState<RegularTransfer[]>(regularList);
  const [updatedRegularList, setUpdatedRegularList] = useState<RegularTransfer[]>(regularList);

  const inputStyle: CSSProperties = {
    border: 'none',
    outline: 'none',
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>, changeId: number) => {
    const property = e.target.name as keyof RegularTransfer;

    // バリデーション
    if (
      property === 'ratio' &&
      (parseFloat(e.target.value) < 0 || 1 < parseFloat(e.target.value))
    ) {
      return;
    }

    // 表示してるregularListを更新 and 変更のあるregularをisChange:true
    setUpdatedRegularList(
      updatedRegularList.map((regular) => {
        if (regular.id !== changeId) {
          return regular;
        }

        //　更新前と比較して変わってたらisChanged -> true
        const defaultRegular = defaultRegularList.find((r) => r.id === changeId) as RegularTransfer;

        const isChanged = e.target.value != defaultRegular[property];

        // 変更後の値をセット
        return {
          ...regular,
          [property]: e.target.value,
          isChanged: isChanged,
        };
      })
    );
  };

  const onChangeCheckbox = (e: React.ChangeEvent<HTMLInputElement>, changeId: number) => {
    let changedRegular: RegularTransfer | undefined = undefined;

    // 値の更新
    setUpdatedRegularList(
      updatedRegularList.map((reg) => {
        if (reg.id === changeId) {
          changedRegular = { ...reg, percentage: e.target.checked };
          return changedRegular;
        }

        return reg;
      })
    );

    if (changedRegular) {
      // DB更新
      updateRegular(changedRegular as RegularTransfer);
      setDefaultRegularList([...updatedRegularList]);
    }
  };

  // input要素のフォーカスが外れた時に変化があればDBをupdateする
  const onBlur = (focusRegular: RegularTransfer) => {
    if (focusRegular.isChanged) {
      updateRegular(focusRegular);
      setDefaultRegularList([...updatedRegularList]);
      focusRegular.isChanged = false;
    }
  };

  // dropdown内での変更を検知してupdateする
  const onClickDropdown = (
    id: number,
    newAccountId: number,
    newAccountName: string,
    column: 'fromAccount' | 'toAccount'
  ) => {
    let changedRegular: RegularTransfer | undefined = undefined;
    setUpdatedRegularList(
      updatedRegularList.map((reg) => {
        if (reg.id !== id) return reg;

        changedRegular = {
          ...reg,
          [column]: newAccountId,
          [`${column}Name`]: newAccountName,
        };
        return changedRegular;
      })
    );
    if (changedRegular) {
      updateRegular(changedRegular);
    }
  };

  // 新規追加処理
  const onClickInsert = () => {
    insertRegular();
    window.location.reload();
  };

  // Regular削除処理
  const onClickDeleteButton = (id: number) => {
    deleteRegular(id);
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
      <Table style={{ marginBottom: 0 }}>
        <thead>
          <tr>
            <th>from</th>
            <th>to</th>
            <th>description</th>
            <th>amount</th>
            <th>ratio</th>
            <th>ratio flag</th>
          </tr>
        </thead>
        <tbody>
          {updatedRegularList.map((regular) => (
            <tr key={regular.id}>
              <td>
                <AccountDropdown
                  accountList={accountList}
                  transfer={regular}
                  column="fromAccount"
                  onClickDropdown={onClickDropdown}
                />
              </td>
              <td>
                <AccountDropdown
                  accountList={accountList}
                  transfer={regular}
                  column="toAccount"
                  onClickDropdown={onClickDropdown}
                />
              </td>
              <td>
                <input
                  type="text"
                  style={{ ...inputStyle, width: 150 }}
                  name="description"
                  value={regular.description ?? ''}
                  onChange={(e) => onChange(e, regular.id as number)}
                  onBlur={() => onBlur(regular)}
                />
              </td>
              {regular.percentage == false ? (
                <td>
                  <input
                    type="number"
                    style={{ ...inputStyle, width: 100 }}
                    name="amount"
                    value={regular.amount}
                    onChange={(e) => onChange(e, regular.id as number)}
                    onBlur={() => onBlur(regular)}
                  />
                </td>
              ) : (
                <td>---</td>
              )}

              {regular.percentage == true ? (
                <td>
                  <input
                    type="number"
                    style={{ ...inputStyle, width: 100 }}
                    name="ratio"
                    value={regular.ratio}
                    onChange={(e) => onChange(e, regular.id as number)}
                    onBlur={() => onBlur(regular)}
                  />
                </td>
              ) : (
                <td>---</td>
              )}

              <td style={{ textAlign: 'center' }}>
                <input
                  type="checkbox"
                  checked={regular.percentage}
                  onChange={(e) => onChangeCheckbox(e, regular.id as number)}
                  name="percentage"
                />
              </td>
              <td>
                <Button
                  outline
                  className="btn-sm"
                  color="danger"
                  onClick={() => onClickDeleteButton(regular.id as number)}
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

export default RegularTransferTable;
