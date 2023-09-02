import { NextPage } from 'next';
import { useState } from 'react';
import { Dropdown, DropdownMenu, DropdownItem, Button, Input, DropdownToggle } from 'reactstrap';
import axios from 'axios';

const ownApiPath = process.env.NEXT_PUBLIC_OWN_API_PATH;

interface Props {
  accountList: Account[];
  account: Account;
}

const AccountDropdownInAccountList: NextPage<Props> = ({ accountList, account }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen((prevState) => !prevState);
  const firstPreviewName = accountList.find((ac) => ac.id === account.via)?.name;
  const [previewName, setPreviewName] = useState(firstPreviewName ?? '---');

  const onClickAccountName = async (selectedViaId: number) => {
    // '---'が選択された場合,selectedViaId=1とし，undefinedを代入
    const newVia: number | undefined = selectedViaId === -1 ? undefined : selectedViaId;
    const newAccount: Account = { ...account, via: newVia };
    try {
      const res = await axios.patch(`${ownApiPath}/api/account/update`, newAccount);
      setPreviewName(accountList.find((ac) => ac.id === selectedViaId)?.name ?? '---');
      console.log(res.data);
    } catch (error) {
      console.log('Failed to update Account');
    }
  };

  return (
    <div className="d-flex">
      <Dropdown isOpen={dropdownOpen} toggle={toggle} direction="down">
        <DropdownToggle tag="span" style={{ cursor: 'pointer' }}>
          {previewName}
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem header style={{ textAlign: 'center' }}>
            口座選択
          </DropdownItem>
          {/* 口座が指定してある場合は，選択解除する選択肢を追加 */}
          {previewName !== '---' && (
            <DropdownItem
              style={{
                textAlign: 'center',
                cursor: 'default',
              }}
              onClick={() => onClickAccountName(-1)}
            >
              ---
            </DropdownItem>
          )}

          {/* 口座一覧を表示してクリックしたら更新 */}
          {accountList.map(
            (account) =>
              account.name !== previewName && (
                <DropdownItem
                  key={account.id}
                  style={{
                    textAlign: 'center',
                    cursor: 'default',
                  }}
                  onClick={() => onClickAccountName(account.id as number)}
                >
                  {account.name}
                </DropdownItem>
              )
          )}
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

export default AccountDropdownInAccountList;
