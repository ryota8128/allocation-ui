import { NextPage } from 'next';
import { Table } from 'reactstrap';
import AccountDropdown from './AccountDropdown';
import { CSSProperties, useState } from 'react';
import { updateTemporary } from '@/lib/temporaryReq';

interface Props {
  temporaryList: TemporaryTransfer[];
  accountList: Account[];
}

const TemporaryTransferTable: NextPage<Props> = ({
  temporaryList,
  accountList,
}) => {
  const [defaultTemporaryList, setDefaultTemporaryList] =
    useState<TemporaryTransfer[]>(temporaryList);
  const [updatedTemporaryList, setUpdatedTemporaryList] =
    useState<TemporaryTransfer[]>(temporaryList);

  const inputStyle: CSSProperties = {
    border: 'none',
    outline: 'none',
  };

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    changeId: number
  ) => {
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

  return (
    <div>
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
                />
              </td>
              <td>
                <AccountDropdown
                  accountList={accountList}
                  transfer={temporary}
                  column="toAccount"
                />
              </td>
              <td>
                <input
                  type="text"
                  style={{ ...inputStyle, width: 150 }}
                  name="description"
                  value={temporary.description}
                  onChange={(e) => onChange(e, temporary.id)}
                  onBlur={() => onBlur(temporary)}
                />
              </td>
              <td>
                <input
                  type="number"
                  style={{ ...inputStyle, width: 100 }}
                  name="amount"
                  value={temporary.amount}
                  onChange={(e) => onChange(e, temporary.id)}
                  onBlur={() => onBlur(temporary)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default TemporaryTransferTable;
