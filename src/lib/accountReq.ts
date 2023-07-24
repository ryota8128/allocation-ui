import axios, { AxiosRequestConfig } from 'axios';
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
export const getAccountList = async (token: string) => {
  const res = await axios.get(`${apiUrl}/api/account/list`, {
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

  const response = await axios.post(`${apiUrl}/api/account`, account, config);
};
