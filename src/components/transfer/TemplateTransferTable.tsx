import { NextPage } from 'next';
import { Table, Form, Button } from 'reactstrap';
import AccountDropdown from './table/dropdown/AccountDropdown';
import { Dispatch, SetStateAction, useState } from 'react';
import axios from 'axios';
import { CSSProperties } from 'react';
import { error } from 'console';
import { useRouter } from 'next/router';

const ownApiPath = process.env.NEXT_PUBLIC_OWN_API_PATH;

interface Props {
  templateList: TemplateTransfer[];
  accountList: Account[];
  setErrMsg: Dispatch<SetStateAction<string>>;
}

const TemplateTransferTable: NextPage<Props> = ({ templateList, accountList, setErrMsg }) => {
  const [defaultTemplateList, setDefaultTemplateList] = useState<TemplateTransfer[]>(templateList);
  const [updatedTemplateList, setUpdatedTemplateList] = useState<TemplateTransfer[]>(templateList);
  const [newTemplateList, setNewTemplateList] = useState<TemplateTransfer[]>([]);
  const [newTemplateKey, setNewTemplateKey] = useState(0);

  const inputStyle: CSSProperties = {
    border: 'none',
    outline: 'none',
  };

  const updateTemplate = async (template: TemplateTransfer) => {
    try {
      await axios.patch(`${ownApiPath}/api/template/update`, template);
      console.log('Success to update TemplateTransfer');
    } catch (error) {
      console.log('Failed to update TemplateTransfer');
      setErrMsg('Template Transferの更新に失敗しました．');
    }
  };

  // 既存Templateにおいてdropdown内での変更を検知してupdateする
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

  const onClickDropdownForNewTemplate = (
    id: number,
    newAccountId: number,
    newAccountName: string,
    column: 'fromAccount' | 'toAccount'
  ) => {
    let changedTemplate: TemplateTransfer | undefined = undefined;
    setNewTemplateList(
      newTemplateList.map((transfer) => {
        if (transfer.id !== id) return transfer;

        changedTemplate = {
          ...transfer,
          [column]: newAccountId,
          [`${column}Name`]: newAccountName,
        };
        return changedTemplate;
      })
    );
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
      await axios.patch(`${ownApiPath}/api/template/update`, focusTemplate);
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
      .delete(`${ownApiPath}/api/template/delete`, {
        params: {
          id,
        },
      })
      .then(() => {
        console.log('Success to delete TemporaryTransfer');
        setUpdatedTemplateList(updatedTemplateList.filter((t) => t.id !== id));
        setDefaultTemplateList(defaultTemplateList.filter((t) => t.id !== id));
      })
      .catch(() => {
        console.log('Failed to delete TemporaryTransfer');
        setErrMsg('Template Transferの削除に失敗しました．');
      });
  };

  const onChangeNewDescription = (e: React.ChangeEvent<HTMLInputElement>, changeId: number) => {
    setNewTemplateList(
      newTemplateList.map((t) => {
        if (t.id === changeId) return { ...t, description: e.target.value };
        return t;
      })
    );
  };

  const onClickAddNewTemplate = () => {
    setNewTemplateList([...newTemplateList, { id: newTemplateKey }]);
    setNewTemplateKey((pre) => pre + 1);
    console.log(newTemplateList);
  };

  const onClickInsert = (template: TemplateTransfer) => {
    const newTemplate: TemplateTransfer = {
      fromAccount: template.fromAccount,
      toAccount: template.toAccount,
      description: template.description,
    };

    axios
      .post(`${ownApiPath}/api/template/insert`, newTemplate)
      .then((res) => {
        console.log(res);
        console.log('Template Transferの追加に成功しました．');
        const insertedTemplate: TemplateTransfer = res.data as TemplateTransfer;
        setUpdatedTemplateList([...updatedTemplateList, insertedTemplate]);
        setNewTemplateList(newTemplateList.filter((t) => t.id !== template.id));
      })
      .catch((err) => {
        console.warn(err.response);
        setErrMsg(err.response.data);
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
          {/* 新規追加前のTemplateTransfer */}
          {newTemplateList.map((transfer) => (
            <tr key={transfer.id}>
              <td>
                <AccountDropdown
                  accountList={accountList}
                  transfer={transfer}
                  column="fromAccount"
                  onClickDropdown={onClickDropdownForNewTemplate}
                />
              </td>
              <td>
                <AccountDropdown
                  accountList={accountList}
                  transfer={transfer}
                  column="toAccount"
                  onClickDropdown={onClickDropdownForNewTemplate}
                />
              </td>
              <td style={{ textAlign: 'center' }}>
                <input
                  type="text"
                  style={{ ...inputStyle, width: 150, textAlign: 'right' }}
                  name="description"
                  value={transfer.description ?? ''}
                  onChange={(e) => onChangeNewDescription(e, transfer.id as number)}
                  onBlur={() => onBlurDescription(transfer)}
                />
              </td>
              <td>
                <Button
                  outline
                  className="btn-sm"
                  color="primary"
                  onClick={() => onClickInsert(transfer)}
                >
                  追加
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Button className="btn-sm" onClick={onClickAddNewTemplate}>
        新規追加
      </Button>

      <p></p>
    </div>
  );
};

export default TemplateTransferTable;
