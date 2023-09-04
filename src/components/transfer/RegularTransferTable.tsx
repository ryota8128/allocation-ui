import { NextPage } from 'next';
import { Button, Table } from 'reactstrap';
import AccountDropdown from './table/dropdown/AccountDropdown';
import { CSSProperties, useEffect, useState } from 'react';
import { deleteRegular, insertRegular, updateRegular } from '@/lib/regularReq';
import axios from 'axios';

const ownApiPath = process.env.NEXT_PUBLIC_OWN_API_PATH;

interface Props {
  regularList: RegularTransfer[];
  accountList: Account[];
}

const RegularTransferTable: NextPage<Props> = ({ regularList, accountList }) => {
  const [defaultRegularList, setDefaultRegularList] = useState<RegularTransfer[]>(regularList);
  const [updatedRegularList, setUpdatedRegularList] = useState<RegularTransfer[]>(regularList);
  const [newRegularList, setNewRegularList] = useState<RegularTransfer[]>([]);
  const [newRegularKey, setNewRegularKey] = useState(-1);

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

  // Regular削除処理
  const onClickDeleteButton = (id: number) => {
    axios
      .delete(`${ownApiPath}/api/regular/delete`, {
        params: {
          id,
        },
      })
      .then(() => {
        console.log('Success to delete TemporaryTransfer');
        setUpdatedRegularList(updatedRegularList.filter((t) => t.id !== id));
        setDefaultRegularList(defaultRegularList.filter((t) => t.id !== id));
      })
      .catch(() => {
        console.log('Failed to delete TemporaryTransfer');
        // setErrMsg('Regular Transferの削除に失敗しました．');
      });
  };

  // 新規追加処理
  const onClickCreateRegular = () => {
    setNewRegularList([...newRegularList, { id: newRegularKey, percentage: false, amount: 0 }]);
    setNewRegularKey((pre) => pre - 1);
  };

  const onClickDropdownForNewTemplate = (
    id: number,
    newAccountId: number,
    newAccountName: string,
    column: 'fromAccount' | 'toAccount'
  ) => {
    let changedRegular: RegularTransfer | undefined = undefined;
    setNewRegularList(
      newRegularList.map((regular) => {
        if (regular.id !== id) return regular;

        changedRegular = {
          ...regular,
          [column]: newAccountId,
          [`${column}Name`]: newAccountName,
        };
        return changedRegular;
      })
    );
  };

  const onChangeNewRegular = (e: React.ChangeEvent<HTMLInputElement>, changeId: number) => {
    const property = e.target.name as keyof RegularTransfer;

    // バリデーション
    if (
      property === 'ratio' &&
      (parseFloat(e.target.value) < 0 || 1 < parseFloat(e.target.value))
    ) {
      return;
    }

    // 表示してるregularListを更新 and 変更のあるregularをisChange:true
    setNewRegularList(
      newRegularList.map((regular) => {
        if (regular.id !== changeId) {
          return regular;
        }

        // 変更後の値をセット
        return {
          ...regular,
          [property]: e.target.value,
        };
      })
    );
  };

  const onChangeNewRegularCheckbox = (e: React.ChangeEvent<HTMLInputElement>, changeId: number) => {
    // 値の更新
    setNewRegularList(
      newRegularList.map((reg) => {
        if (reg.id === changeId) {
          return { ...reg, percentage: e.target.checked };
        }
        return reg;
      })
    );
  };

  // todo:削除
  useEffect(() => {
    console.log(newRegularList);
  }, [newRegularList]);

  const onClickInsert = (regular: RegularTransfer) => {
    const newRegular: RegularTransfer = {
      fromAccount: regular.fromAccount,
      toAccount: regular.toAccount,
      description: regular.description,
      percentage: regular.percentage,
      ratio: regular.ratio,
    };

    axios
      .post(`${ownApiPath}/api/regular/insert`, newRegular)
      .then((res) => {
        console.log(res);
        console.log('Regular Transferの追加に成功しました．');
        const insertedTemplate: TemplateTransfer = res.data as TemplateTransfer;
        setUpdatedRegularList([...updatedRegularList, insertedTemplate]);
        setNewRegularList(newRegularList.filter((r) => r.id !== regular.id));
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
        <Table style={{ marginBottom: 0, width: '700px' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'center' }}>from</th>
              <th style={{ textAlign: 'center' }}>to</th>
              <th style={{ textAlign: 'center' }}>description</th>
              <th style={{ textAlign: 'center' }}>amount</th>
              <th style={{ textAlign: 'center' }}>ratio</th>
              <th style={{ textAlign: 'center' }}>ratio flag</th>
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
                    style={{ ...inputStyle, width: 150, textAlign: 'right' }}
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
                      style={{
                        ...inputStyle,
                        width: 100,
                        textAlign: 'right',
                        fontFamily: 'Lining',
                      }}
                      name="amount"
                      value={regular.amount}
                      onChange={(e) => onChange(e, regular.id as number)}
                      onBlur={() => onBlur(regular)}
                    />
                  </td>
                ) : (
                  <td style={{ textAlign: 'right' }}>
                    <span
                      style={{
                        width: 100,
                        fontFamily: 'Lining',
                      }}
                    >
                      ---
                    </span>
                  </td>
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
                    disabled
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

            {/* 新規追加前のRegularTransferリスト */}
            {newRegularList.map((r) => (
              <tr key={r.id}>
                <td>
                  <AccountDropdown
                    accountList={accountList}
                    transfer={r}
                    column="fromAccount"
                    onClickDropdown={onClickDropdownForNewTemplate}
                  />
                </td>
                <td>
                  <AccountDropdown
                    accountList={accountList}
                    transfer={r}
                    column="toAccount"
                    onClickDropdown={onClickDropdownForNewTemplate}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    style={{ ...inputStyle, width: 150, textAlign: 'right' }}
                    name="description"
                    value={r.description ?? ''}
                    onChange={(e) => onChangeNewRegular(e, r.id as number)}
                  />
                </td>
                {r.percentage == false ? (
                  <td>
                    <input
                      type="number"
                      style={{
                        ...inputStyle,
                        width: 100,
                        textAlign: 'right',
                        fontFamily: 'Lining',
                      }}
                      name="amount"
                      value={r.amount}
                      onChange={(e) => onChangeNewRegular(e, r.id as number)}
                    />
                  </td>
                ) : (
                  <td style={{ textAlign: 'right' }}>---</td>
                )}

                {r.percentage == true ? (
                  <td>
                    <input
                      type="number"
                      style={{ ...inputStyle, width: 100 }}
                      name="ratio"
                      value={r.ratio}
                      onChange={(e) => onChangeNewRegular(e, r.id as number)}
                    />
                  </td>
                ) : (
                  <td>---</td>
                )}

                <td style={{ textAlign: 'center' }}>
                  <input
                    type="checkbox"
                    checked={r.percentage}
                    onChange={(e) => onChangeNewRegularCheckbox(e, r.id as number)}
                    name="percentage"
                    disabled
                  />
                </td>
                <td>
                  <Button
                    outline
                    className="btn-sm"
                    color="primary"
                    onClick={() => onClickInsert(r)}
                  >
                    追加
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <Button className="btn-sm" onClick={onClickCreateRegular}>
        新規追加
      </Button>
    </div>
  );
};

export default RegularTransferTable;
