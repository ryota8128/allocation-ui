import RegularTransferTable from '@/components/transfer/RegularTransferTable';
import axios from 'axios';

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

export const updateRegular = async (regular: RegularTransfer) => {
  try {
    await axios.post('/api/regular/update', regular);
    console.log('Success to update RegularTransfer');
  } catch (error) {
    console.log('Failed to update RegularTransfer');
    // TODO: ログインし直し
  }
};

export const insertRegular = async () => {
  const newRegular: RegularTransfer = {
    amount: 0,
    ratio: 0,
    percentage: false,
  };
  try {
    await axios.post('api/regular/insert', newRegular);
    console.log('Success to insert RegularTransfer')
  } catch (error) {
    console.log('Failed to update RegularTransfer');
    // TODO: ログインし直し
  }
};
