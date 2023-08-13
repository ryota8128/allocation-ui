import { NextPage } from 'next';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle, NavItem, NavLink } from 'reactstrap';
import { CSSProperties, useState } from 'react';
import Link from 'next/link';
import { LinkButton } from './LinkButton';
import { useRouter } from 'next/router';

interface Props {
  username: string;
}

const NavDropdown: NextPage<Props> = ({ username }) => {
  const router = useRouter();
  const navToggleStyle: CSSProperties = {
    fontSize: 22,
    color: '#fff',
    cursor: 'pointer',
  };

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const toggle = () => {
    setIsOpen((prev) => !prev);
  };

  const onClickDropdownItem = (path: string) => {
    router.push(path);
  };

  return (
    <div>
      <Dropdown toggle={toggle} isOpen={isOpen} direction="down">
        <DropdownToggle data-toggle="dropdown" tag="div" style={navToggleStyle}>
          {username}
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem
            style={{ textAlign: 'center' }}
            onClick={() => onClickDropdownItem('/user')}
          >
            ユーザ情報
          </DropdownItem>
          <DropdownItem
            style={{ textAlign: 'center' }}
            onClick={() => onClickDropdownItem('/account/list')}
          >
            口座情報
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

export default NavDropdown;
