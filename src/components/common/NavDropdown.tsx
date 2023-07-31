import { NextPage } from 'next';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle, NavItem, NavLink } from 'reactstrap';
import { CSSProperties, useState } from 'react';
import Link from 'next/link';
import { LinkButton } from './LinkButton';

interface Props {
  username: string;
}

const NavDropdown: NextPage<Props> = ({ username }) => {
  const navToggleStyle: CSSProperties = {
    fontSize: 22,
    color: '#fff',
    cursor: 'pointer',
  };

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const toggle = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div>
      <Dropdown toggle={toggle} isOpen={isOpen} direction="down">
        <DropdownToggle data-toggle="dropdown" tag="div" style={navToggleStyle}>
          {username}
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem>
            <Link href="/user" style={{ textDecoration: 'none' }}>
              ユーザ情報
            </Link>
          </DropdownItem>
          <DropdownItem>
            <Link href="/account/list" style={{ textDecoration: 'none' }}>
              口座情報
            </Link>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

export default NavDropdown;
