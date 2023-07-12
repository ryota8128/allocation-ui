import Account from '@/types/Account';
import axios, { AxiosRequestConfig } from 'axios';

export const getAccount = async (token: string) => {
  const res = await axios.get('http://localhost:8080/api/account/list', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data as Account[];
};

export const addAccount = async (account: Account, token: string) => {
  const config: AxiosRequestConfig<Account> = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(
    'http://localhost:8080/api/account',
    account,
    config
  );
};
