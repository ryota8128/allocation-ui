import Transfer from '@/types/Transfer';
import axios from 'axios';

const apiUrl = process.env.API_URL;

export const getTransfers = async (token: string) => {
  const res = await axios.get(`${apiUrl}/api/transfer/list`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data as Transfer[];
};

export const findOneTransfer = async (token: string, id: number) => {
  const res = await axios.get(`${apiUrl}/api/transfer?id=${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data as Transfer;
};

