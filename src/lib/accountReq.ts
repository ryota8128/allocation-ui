import Account from '@/domain/Account';
import axios, { AxiosRequestConfig } from 'axios';

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
