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

export const addAccount = async (
  event: React.FormEvent<HTMLFormElement>,
  account: Account
) => {
  event.preventDefault();
  account.ownerId = 1;
  const config: AxiosRequestConfig<Account> = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const response = await axios.post(
      'http://localhost:8080/api/account',
      account,
      config
    );
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
};
