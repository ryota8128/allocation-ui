import { NextPage } from 'next';
import Account from '../../types/Account';
import { Table } from 'reactstrap';

interface Props {
  accountList: Account[];
}

const TableAccountList: NextPage<Props> = ({ accountList }) => {
  return (
    <div>
      <Table>
        <thead>
          <tr>
            <th>id</th>
            <th>口座名</th>
            <th>無料振込回数</th>
            <th>振込手数料</th>
          </tr>
        </thead>
        <tbody>
          {accountList.map((account) => (
            <tr key={account.id}>
              <th scope="row">1</th>
              <td>{account.name}</td>
              <td>{account.numFreeTransfer}</td>
              <td>{account.transferFee}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default TableAccountList;
