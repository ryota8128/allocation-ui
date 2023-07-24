import axios from 'axios';
const apiUrl = process.env.API_URL;
export const findRegular = async (token: string) => {
  const res = await axios.get(`${apiUrl}/api/regular/list`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data as RegularTransfer[];
};
