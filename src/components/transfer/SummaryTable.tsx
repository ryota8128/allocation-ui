import { NextPage } from 'next';
import { Table } from 'reactstrap';
import { formatNumberWithCommas } from '../../lib/Utils';

interface Props {
  summary: Summary;
  accountList: Account[];
}

const SummaryTable: NextPage<Props> = ({ summary, accountList }) => {
  const sortedSummary = Object.entries(summary)
    .sort((a, b) => a[1] - b[1])
    .map(([id, amount]: [string, number]) => {
      const accountName = accountList.find((account) => account.id === parseInt(id))?.name;
      return [accountName, amount];
    });

  return (
    <div style={{ overflowX: 'auto' }}>
      <Table style={{ width: '630px' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'center' }}>account</th>
            <th style={{ textAlign: 'center' }}>amount</th>
          </tr>
        </thead>
        <tbody>
          {sortedSummary.map(([accountName, amount]) => (
            <tr key={accountName}>
              <td style={{ textAlign: 'center' }}>{accountName}</td>
              <td style={{ fontFamily: 'Lining', textAlign: 'right', paddingRight: 200 }}>
                {formatNumberWithCommas(amount as number)}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default SummaryTable;
