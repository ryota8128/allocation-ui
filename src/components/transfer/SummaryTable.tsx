import { NextPage } from 'next';
import { Table } from 'reactstrap';

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

  console.log(sortedSummary);
  return (
    <div>
      <Table>
        <thead>
          <tr>
            <td>account</td>
            <td>amount</td>
          </tr>
        </thead>
        <tbody>
          {sortedSummary.map(([accountName, amount]) => (
            <tr key={accountName}>
              <td>{accountName}</td>
              <td>{amount}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default SummaryTable;
