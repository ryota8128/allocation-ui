import axios, { AxiosRequestConfig } from 'axios';
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const ownApiPath = process.env.NEXT_PUBLIC_OWN_API_PATH;

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

export const addAccountWithNameApi = async (accountName: string) => {
  const account: Account = { name: accountName };
  try {
    await axios.post(`${ownApiPath}/api/account/insert`, account);
    console.log('Success to insert Account');
  } catch (error) {
    console.log('Failed to insert Account');
  }
};

export const addAccountWithApi = async (account: Account) => {
  try {
    await axios.post(`${ownApiPath}/api/account/insert`, account);
    console.log('Success to insert Account');
  } catch (error) {
    console.log('Failed to insert Account');
  }
};

export const findOneAccountWithApi = async (name: string) => {
  try {
    const res = await axios.get(`${ownApiPath}/api/account/findOneWithName`, {
      params: {
        name,
      },
    });
    const account: Account = res.data;
    return account;
  } catch (error) {
    console.log('Failed to findOne Account');
  }
};

export const updateAccountWithApi = async (account: Account) => {
  try {
    const res = await axios.patch(`${ownApiPath}/api/account/update`, account);
    console.log('Success to update Account');
  } catch (error) {
    console.log('Failed to update Account');
  }
};

export const deleteAccountWithApi = async (id: number) => {
  try {
    const res = await axios.delete(`${ownApiPath}/api/account/delete`, {
      params: {
        id,
      },
    });
    console.log('Success to delete Account');
  } catch (error) {
    console.log('Failed to delete Account');
  }
};
