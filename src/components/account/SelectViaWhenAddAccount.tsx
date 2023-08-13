import { NextPage } from 'next';
import { Dispatch, SetStateAction, useState } from 'react';
import { Dropdown, DropdownMenu, DropdownItem, DropdownToggle } from 'reactstrap';
import axios from 'axios';

interface Props {
  accountList: Account[];
  account: Account;
  setNewAccount: Dispatch<SetStateAction<Account>>;
}

const SelectViaWhenAddAccount: NextPage<Props> = ({ accountList, account, setNewAccount }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen((prevState) => !prevState);
  const [previewName, setPreviewName] = useState('---');

  const onClickAccountName = async (selectedViaId: number) => {
    // '---'が選択された場合,selectedViaId=1とし，undefinedを代入
    const newVia: number | undefined = selectedViaId === -1 ? undefined : selectedViaId;
    const newAccount: Account = { ...account, via: newVia };
    setNewAccount(newAccount);
    setPreviewName(accountList.find((ac) => ac.id === selectedViaId)?.name ?? '---');
  };

  return (
    <div className="d-flex">
      <Dropdown isOpen={dropdownOpen} toggle={toggle} direction="down">
        <DropdownToggle tag="span" style={{ cursor: 'pointer' }}>
          {previewName}
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem header>口座選択</DropdownItem>
          {/* 口座が指定してある場合は，選択解除する選択肢を追加 */}
          {previewName !== '---' && (
            <DropdownItem
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
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
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
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

export default SelectViaWhenAddAccount;
