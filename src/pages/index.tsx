import Head from 'next/head';
import Image from 'next/image';
import { Inter } from 'next/font/google';
import FormAddAccount from '@/components/account/FormAddAccount';
import { Button } from 'reactstrap';
import styles from '@/styles/Home.module.css';
import Link from 'next/link';
import { LinkButton } from '@/components/common/LinkButton';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  return (
    <>
      <main style={{ marginTop: 100 }}>
        <LinkButton href='/addAccount' text='アカウント追加' />
        <LinkButton href='/login' text='ログイン' />
        <LinkButton href='/accountList' text='口座一覧' />
      </main>
    </>
  );
}
