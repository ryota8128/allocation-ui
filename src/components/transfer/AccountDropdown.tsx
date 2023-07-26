import { updateRegular } from '@/lib/regularReq';
import { updateTemporary } from '@/lib/temporaryReq';
import { NextPage } from 'next';
import { useSession } from 'next-auth/react';
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
}

const AccountDropdown: NextPage<Props> = ({
  accountList,
  transfer,
  column,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen((prevState) => !prevState);

  const [title, setTitle] = useState<string>(
    column === 'fromAccount'
      ? transfer.fromAccountName ?? '-'
      : transfer.toAccountName ?? '-'
  );

  const updateAccount = async (newTitle: string, newAccountId: number) => {
    setTitle(newTitle);
    const newTransfer = { ...transfer, [column]: newAccountId };
    if (transfer.type === 'temporary') {
      await updateTemporary(newTransfer as TemporaryTransfer);
    } else if (transfer.type === 'regular') {
      await updateRegular(newTransfer as RegularTransfer);
    }
  };

  return (
    <div className="d-flex">
      <Dropdown isOpen={dropdownOpen} toggle={toggle} direction="down">
        <DropdownToggle tag="span" style={{ cursor: 'pointer' }}>
          {title}
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem header>口座選択</DropdownItem>
          {accountList.map((account) => (
            <DropdownItem
              key={account.id}
              onClick={() => updateAccount(account.name, account.id as number)}
            >
              {account.name}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

export default AccountDropdown;
