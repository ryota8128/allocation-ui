import { NextPage } from 'next';
import { Table, Form, Button } from 'reactstrap';
import AccountDropdown from './table/dropdown/AccountDropdown';
import { Dispatch, SetStateAction, useState } from 'react';
import axios from 'axios';
import { CSSProperties } from 'react';
import { error } from 'console';

interface Props {
  templateList: TemplateTransfer[];
  accountList: Account[];
  setErrMsg: Dispatch<SetStateAction<string>>;
}

const TemplateTransferTable: NextPage<Props> = ({ templateList, accountList, setErrMsg }) => {
  const [defaultTemplateList, setDefaultTemplateList] = useState<TemplateTransfer[]>(templateList);
  const [updatedTemplateList, setUpdatedTemplateList] = useState<TemplateTransfer[]>(templateList);

  const inputStyle: CSSProperties = {
    border: 'none',
    outline: 'none',
  };

  const updateTemplate = async (template: TemplateTransfer) => {
    try {
      await axios.patch('/api/template/update', template);
      console.log('Success to update TemplateTransfer');
    } catch (error) {
      console.log('Failed to update TemplateTransfer');
      setErrMsg('Template Transferの更新に失敗しました．');
    }
  };

  // dropdown内での変更を検知してupdateする
  const onClickDropdown = (
    id: number,
    newAccountId: number,
    newAccountName: string,
    column: 'fromAccount' | 'toAccount'
  ) => {
    let changedTemplate: TemplateTransfer | undefined = undefined;
    setUpdatedTemplateList(
      updatedTemplateList.map((transfer) => {
        if (transfer.id !== id) return transfer;

        changedTemplate = {
          ...transfer,
          [column]: newAccountId,
          [`${column}Name`]: newAccountName,
        };
        return changedTemplate;
      })
    );
    if (changedTemplate) {
      updateTemplate(changedTemplate);
    }
  };

  const onChangeDescription = (e: React.ChangeEvent<HTMLInputElement>, changeId: number) => {
    setUpdatedTemplateList(
      updatedTemplateList.map((temp) => {
        if (temp.id != changeId) {
          return temp;
        }

        //　更新前と比較して変わってたらisChanged -> true
        const defaultTemplate = defaultTemplateList.find(
          (t) => t.id === changeId
        ) as TemplateTransfer;
        const isChange = e.target.value != defaultTemplate.description;

        return {
          ...temp,
          description: e.target.value,
          isChange,
        };
      })
    );
  };

  const onBlurDescription = async (focusTemplate: TemplateTransfer) => {
    if (!focusTemplate.isChange) return;

    try {
      await axios.patch('/api/template/update', focusTemplate);
      console.log('Success to update Template Transfer');
    } catch (error) {
      console.warn('Failed to update Template Transfer');
      setErrMsg('Template Transferの更新に失敗しました．');
      return;
    }

    setDefaultTemplateList([...updatedTemplateList]);
    focusTemplate.isChange = false;
  };

  const onClickDeleteTemplate = (id: number) => {
    axios
      .delete('/api/template/delete', {
        params: {
          id,
        },
      })
      .then(() => {
        console.log('Success to delete TemporaryTransfer');
        window.location.reload();
      })
      .catch(() => {
        console.log('Failed to delete TemporaryTransfer');
        setErrMsg('Template Transferの削除に失敗しました．');
      });
  };

  return (
    <div>
      <style jsx>{`
        /* 削除ボタンがはみ出すようにする */
        td:last-child {
          white-space: nowrap;
          border: none;
        }
      `}</style>
      <Table>
        <thead>
          <tr style={{ whiteSpace: 'nowrap' }}>
            <th style={{ textAlign: 'center' }}>from</th>
            <th style={{ textAlign: 'center' }}>to</th>
            <th style={{ textAlign: 'center' }}>description</th>
          </tr>
        </thead>
        <tbody>
          {updatedTemplateList.map((transfer) => (
            <tr key={transfer.id}>
              <td>
                <AccountDropdown
                  accountList={accountList}
                  transfer={transfer}
                  column="fromAccount"
                  onClickDropdown={onClickDropdown}
                />
              </td>
              <td>
                <AccountDropdown
                  accountList={accountList}
                  transfer={transfer}
                  column="toAccount"
                  onClickDropdown={onClickDropdown}
                />
              </td>
              <td style={{ textAlign: 'center' }}>
                <input
                  type="text"
                  style={{ ...inputStyle, width: 150, textAlign: 'right' }}
                  name="description"
                  value={transfer.description ?? ''}
                  onChange={(e) => onChangeDescription(e, transfer.id as number)}
                  onBlur={() => onBlurDescription(transfer)}
                />
              </td>
              <td>
                <Button
                  outline
                  className="btn-sm"
                  color="danger"
                  onClick={() => onClickDeleteTemplate(transfer.id as number)}
                >
                  削除
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <p></p>
    </div>
  );
};

export default TemplateTransferTable;
