import Link from 'next/link';
import { ReactNode } from 'react';
import { CSSProperties } from 'react';

type Props = {
  children: ReactNode;
  href: string;
};

const Item: React.FC<Props> = ({ children, href }) => {
  const item: CSSProperties = {
    textAlign: 'center',
    fontFamily: 'Inter',
    fontSize: '17px',
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 'normal',
    marginBottom: '22px',
  };
  return (
    <>
      <Link href={href} style={item}>
        {children}
      </Link>
    </>
  );
};

export default Item;
