import Head from 'next/head';
import Image from 'next/image';
import { Inter } from 'next/font/google';
import FormAddAccount from '@/components/account/FormAddAccount';
import { Button } from 'reactstrap';
import styles from '@/styles/Home.module.css';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  return (
    <>
      <main style={{ marginTop: 100 }}>
        <div style={{ marginBottom: 30 }}>
          <Link href="/addAccount">
            <Button>アカウント追加</Button>
          </Link>
        </div>
        <div>
          <Link href="/login">
            <Button>ログイン</Button>
          </Link>
        </div>
      </main>
    </>
  );
}
