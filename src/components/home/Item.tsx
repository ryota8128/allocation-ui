import Link from 'next/link';
import { ReactNode } from 'react';
import { CSSProperties } from 'react';

type Props = {
  children: ReactNode;
};

const Item: React.FC<Props> = ({ children }) => {
  const item: CSSProperties = {
    textAlign: 'center',
    fontFamily: 'Inter',
    fontSize: '17px',
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 'normal',
  };
  return (
    <>
      <Link href="/new-transfer" style={item}>
        {children}
      </Link>
    </>
  );
};

export default Item;
