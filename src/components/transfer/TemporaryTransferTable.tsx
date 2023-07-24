import { NextPage } from 'next';
import { Table } from 'reactstrap';
import AccountDropdown from './AccountDropdown';

interface Props {
  temporaryList: TemporaryTransfer[];
  accountList: Account[];
}

const TemporaryTransferTable: NextPage<Props> = ({
  temporaryList,
  accountList,
}) => {
  const updateTemporary = () => {};
  return (
    <div>
      <Table hover>
        <thead>
          <tr>
            <th>from</th>
            <th>to</th>
            <th>description</th>
            <th>amount</th>
          </tr>
        </thead>
        <tbody>
          {temporaryList.map((temporary) => (
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
              <td>{temporary.description}</td>
              <td>{temporary.amount}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default TemporaryTransferTable;
