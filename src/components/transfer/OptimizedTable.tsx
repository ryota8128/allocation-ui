import { formatNumberWithCommas } from '@/lib/Utils';
import { NextPage } from 'next';
import { Table } from 'reactstrap';

interface Props {
  summary: TransferSummary[];
  accountList: Account[];
}

const OptimizedTable: NextPage<Props> = ({ summary, accountList }) => {
  return (
    <div>
      <Table style={{ width: 630 }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'center' }}>from</th>
            <th style={{ textAlign: 'center' }}>to</th>
            <th style={{ textAlign: 'center' }}>amount</th>
            <th style={{ textAlign: 'center' }}>done</th>
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
              <tr key={`${s.from}+${accountList.length * s.to}`}>
                <td style={{ textAlign: 'center' }}>{fromName}</td>
                <td style={{ textAlign: 'center' }}>{toName}</td>
                <td style={{ fontFamily: 'Lining', textAlign: 'right', paddingRight: 40 }}>
                  {formatNumberWithCommas(s.amount)}
                </td>
                <td style={{ textAlign: 'center' }}>
                  <input type="checkbox" />
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};

export default OptimizedTable;
