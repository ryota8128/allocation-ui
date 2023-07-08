import Link from 'next/link';
import { Button } from 'reactstrap';

type Props = {
  href: string;
  text: string;
};

export const LinkButton: React.FC<Props> = ({ href, text }) => {
  return (
    <div style={{ marginBottom: 30 }}>
      <Link href={href}>
        <Button>{text}</Button>
      </Link>
    </div>
  );
};
