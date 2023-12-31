import { addAccountWithNameApi, findOneAccountWithApi } from '@/lib/accountReq';
import { NextPage } from 'next';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Input } from 'reactstrap';
import { PiDotsThreeOutlineLight } from 'react-icons/pi';

interface Props {
  accountList: Account[];
  transfer: TemporaryTransfer | RegularTransfer | TemplateTransfer;
  column: 'fromAccount' | 'toAccount';
  onClickDropdown: (
    id: number,
    newAccountId: number,
    newAccountName: string,
    column: 'fromAccount' | 'toAccount'
  ) => void;
  setDisplayAccountList: Dispatch<SetStateAction<Account[]>>;
}

const AccountDropdown: NextPage<Props> = ({
  accountList,
  transfer,
  column,
  onClickDropdown,
  setDisplayAccountList,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen((prevState) => !prevState);
  const [newAccountName, setNewAccountName] = useState('');
  const [isHoverState, setIsHoverState] = useState<{ [key: number]: boolean }>({});
  const title = column === 'fromAccount' ? transfer.fromAccountName ?? '---' : transfer.toAccountName ?? '---';

  const onClickAddAccount = async () => {
    try {
      await addAccountWithNameApi(newAccountName);
    } catch (error) {
      return;
    }
    setNewAccountName('');
    //findOneさっき追加したAccount
    const newAccount = (await findOneAccountWithApi(newAccountName)) as Account;
    // findOneしたのをセット
    onClickDropdown(transfer.id as number, newAccount?.id as number, newAccount?.name as string, column);
    toggle();
    setDisplayAccountList([...accountList, newAccount]);
  };

  return (
    <div className="d-flex">
      <Dropdown isOpen={dropdownOpen} toggle={toggle} direction="down">
        <DropdownToggle tag="span" style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
          {title}
        </DropdownToggle>
        <DropdownMenu style={{ zIndex: 9999, position: 'absolute' }}>
          <DropdownItem header style={{ textAlign: 'center' }}>
            口座選択
          </DropdownItem>
          {accountList.map(
            (account) =>
              account.name !== title && (
                <DropdownItem
                  key={account.id}
                  style={{
                    textAlign: 'center',
                    cursor: 'default',
                  }}
                  onClick={() => onClickDropdown(transfer.id as number, account.id as number, account.name, column)}
                >
                  {account.name}
                </DropdownItem>
              )
          )}
          <DropdownItem header>
            <div>
              <Input
                type="text"
                placeholder="新規口座名"
                style={{ width: 140, marginBottom: 10, height: 30 }}
                value={newAccountName}
                onChange={(e) => {
                  setNewAccountName(e.target.value);
                }}
              />
              {newAccountName.length > 0 && (
                <Button outline className="btn-sm" color="primary" onClick={onClickAddAccount}>
                  追加
                </Button>
              )}
            </div>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

export default AccountDropdown;
