import { NextPage } from 'next';
import { useState } from 'react';
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from 'reactstrap';

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

const AccountDropdown: NextPage<Props> = ({
  accountList,
  transfer,
  column,
  onClickDropdown,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen((prevState) => !prevState);

  const title =
    column === 'fromAccount'
      ? transfer.fromAccountName ?? '-'
      : transfer.toAccountName ?? '-';

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
                  onClick={() =>
                    onClickDropdown(
                      transfer.id as number,
                      account.id as number,
                      account.name,
                      column
                    )
                  }
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

export default AccountDropdown;
