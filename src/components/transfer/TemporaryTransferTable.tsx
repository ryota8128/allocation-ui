import { NextPage } from 'next';
import { Table } from 'reactstrap';

interface Props {
  temporaryList: TemporaryTransfer[];
}

const TemporaryTransferTable: NextPage<Props> = ({ temporaryList }) => {
  return (
    <div>
      <Table hover responsive>
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
              <td>{temporary.fromAccountName}</td>
              <td>{temporary.toAccountName}</td>
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
