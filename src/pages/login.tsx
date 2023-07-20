import FormLogin from '@/components/login/FormLogin';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

interface Props {}

const Login: NextPage<Props> = () => {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const { error, logout } = router.query;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (logout === 'success') {
      toast.success('ログアウトしました');
      router.replace(router.pathname); // クエリパラメータを削除する
    }
  }, [logout]);

  useEffect(() => {
    if (error === 'invalid') {
      toast.error('未入力の項目があります');
    } else if (error === 'failed') {
      toast.error('ユーザー名または，パスワードが間違っています');
    }
  }, [error]);

  return (
    <div>
      {isMounted && <Toaster />}
      <FormLogin />
    </div>
  );
};

export default Login;
