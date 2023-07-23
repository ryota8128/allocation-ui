import axios from 'axios';
const apiUrl = process.env.API_URL;
export const getAccount = async (token: string) => {
  const res = await axios.get(`${apiUrl}/api/temporary/list`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data as TemporaryTransfer[];
};
