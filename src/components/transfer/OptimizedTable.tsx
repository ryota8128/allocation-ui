import { NextPage } from 'next';
import { Table } from 'reactstrap';
import TransferSummary from '@/types/TransferSummary';

interface Props {
  summary: TransferSummary[];
  accountList: Account[];
}

const OptimizedTable: NextPage<Props> = ({ summary, accountList }) => {
  return (
    <div>
      <Table>
        <thead>
          <tr>
            <th>from</th>
            <th>to</th>
            <th>amount</th>
          </tr>
        </thead>
        <tbody>
          {summary.map((s) => {
            let fromName = '---';
            let toName = '---';
            accountList.forEach((account) => {
              if (account.id === s.from) {
                fromName = account.name;
              }
              if (account.id === s.to) {
                toName = account.name;
              }
            });

            return (
              <tr>
                <td>{fromName}</td>
                <td>{toName}</td>
                <td>{s.amount}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};

export default OptimizedTable;
