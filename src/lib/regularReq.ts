import axios from 'axios';
import { headers } from 'next/dist/client/components/headers';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const findRegular = async (token: string) => {
  const res = await axios.get(`${apiUrl}/api/regular/list`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const regularList: RegularTransfer[] = res.data;
  const regularListEx: RegularTransfer[] = regularList.map((regular) => {
    return {
      ...regular,
      type: 'regular',
      isChanged: false,
    };
  });
  return regularListEx;
};

export const updateRegular = async (
  regular: RegularTransfer
) => {
  try {
    await axios.post('/api/regular/update', regular);
    console.log('Success to update RegularTransfer');
  } catch (error) {
    console.log('Failed to update RegularTransfer');
  }
};
