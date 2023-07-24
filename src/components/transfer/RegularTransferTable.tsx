import { NextPage } from 'next'
import { Table } from 'reactstrap';

interface Props {
  regularList: RegularTransfer[];
}

const RegularTransferTable: NextPage<Props> = ({regularList}) => {
  return (
    <div>
      <Table hover responsive>
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
            <tr>
              <td>{regular.fromAccount}</td>
              <td>{regular.toAccount}</td>
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

  )
}

export default RegularTransferTable
