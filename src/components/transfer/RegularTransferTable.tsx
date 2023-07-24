import { NextPage } from 'next';
import { Table } from 'reactstrap';
import AccountDropdown from './AccountDropdown';

interface Props {
  regularList: RegularTransfer[];
  accountList: Account[];
}

const RegularTransferTable: NextPage<Props> = ({
  regularList,
  accountList,
}) => {
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
          {regularList.map((regular) => (
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
              <td>{regular.description}</td>
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
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default RegularTransferTable;
