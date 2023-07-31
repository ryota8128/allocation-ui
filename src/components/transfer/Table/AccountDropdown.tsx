import { addAccountWithNameApi, findOneAccountWithApi } from '@/lib/accountReq';
import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Input } from 'reactstrap';
import { flattenDiagnosticMessageText } from 'typescript';
import SampleDropdown from '@/components/transfer/table/dropdown/SampleDropdown';
import { PiDotsThreeOutlineLight } from 'react-icons/pi';

interface Props {
  accountList: Account[];
  transfer: TemporaryTransfer | RegularTransfer;
  column: 'fromAccount' | 'toAccount';
  onClickDropdown: (
    id: number,
    newAccountId: number,
    newAccountName: string,
    column: 'fromAccount' | 'toAccount'
  ) => void;
}

const AccountDropdown: NextPage<Props> = ({ accountList, transfer, column, onClickDropdown }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen((prevState) => !prevState);
  const [newAccountName, setNewAccountName] = useState('');
  const [isHoverState, setIsHoverState] = useState<{ [key: number]: boolean }>({});
  const title =
    column === 'fromAccount' ? transfer.fromAccountName ?? '---' : transfer.toAccountName ?? '---';

  const onClickAddAccount = async () => {
    await addAccountWithNameApi(newAccountName);
    setNewAccountName('');
    //findOneさっき追加したAccount
    const newAccount = await findOneAccountWithApi(newAccountName);
    // findOneしたのをセット
    onClickDropdown(
      transfer.id as number,
      newAccount?.id as number,
      newAccount?.name as string,
      column
    );
    window.location.reload();
  };

  return (
      <div className="d-flex">
        <Dropdown isOpen={dropdownOpen} toggle={toggle} direction="down">
          <DropdownToggle tag="span" style={{ cursor: 'pointer' }}>
            {title}
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem header>口座選択</DropdownItem>
            {accountList.map(
              (account) =>
                account.name !== title && (
                  <DropdownItem
                    key={account.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'default',
                    }}
                  >
                    <span
                      onClick={() =>
                        onClickDropdown(
                          transfer.id as number,
                          account.id as number,
                          account.name,
                          column
                        )
                      }
                      style={{ cursor: 'pointer' }}
                    >
                      {account.name}
                    </span>
                    <PiDotsThreeOutlineLight
                      style={{ transform: 'scale(1.1)', cursor: 'pointer'}}
                    />
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
