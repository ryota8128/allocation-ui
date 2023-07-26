import { NextPage } from 'next';
import { Table } from 'reactstrap';
import AccountDropdown from './AccountDropdown';
import { useState } from 'react';

interface Props {
  regularList: RegularTransfer[];
  accountList: Account[];
}

const RegularTransferTable: NextPage<Props> = ({
  regularList,
  accountList,
}) => {
  const [updatedRegularList, setUpdatedRegularList] =
    useState<RegularTransfer[]>(regularList);
  const transferProperties: Array<keyof RegularTransfer> = [
    'fromAccountName',
    'toAccountName',
    'description',
    'amount',
    'ratio',
  ];

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    changedRegular: RegularTransfer
  ) => {
    const property = e.target.name as keyof RegularTransfer;
    const changeId = changedRegular.id;

    // 表示してるregularListを更新 and 変更のあるregularをisChange:true
    setUpdatedRegularList(
      updatedRegularList.map((regular) => {
        let isChanged = false;
        if (regular.id === changeId) {
          for (const p of transferProperties) {
            if (p === property) {
              if (
                e.target.value !==
                regularList.filter((reg) => reg.id === changeId)[0][p]
              ) {
                isChanged = true;
                break;
              }
            } else {
              if (
                regular[p] !==
                regularList.filter((reg) => reg.id === changeId)[0][p]
              ) {
                isChanged = true;
                break;
              }
            }
          }
          return {
            ...regular,
            [property]: e.target.value,
            isChanged: isChanged,
          };
        }
        return regular;
      })
    );
  };

  return (
    <div>
      <Table hover>
        <thead>
          <tr>
            <th>from</th>
            <th>to</th>
            <th>description</th>
            <th>amount</th>
            <th>ratio</th>
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
                />
              </td>
              <td>
                <AccountDropdown
                  accountList={accountList}
                  transfer={regular}
                  column="toAccount"
                />
              </td>
              <td>
                <input
                  type="text"
                  style={{
                    border: 'none',
                    outline: 'none',
                    backgroundColor: '#FFF',
                    padding: '5px',
                  }}
                  name="description"
                  value={regular.description}
                  onChange={(e) => onChange(e, regular)}
                />
              </td>
              {regular.percentage == false ? (
                <td>{regular.amount}</td>
              ) : (
                <td>-</td>
              )}

              {regular.percentage == true ? (
                <td>{regular.ratio}</td>
              ) : (
                <td>-</td>
              )}
              <td>{regular.isChanged ? 'change!' : 'not'}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default RegularTransferTable;
