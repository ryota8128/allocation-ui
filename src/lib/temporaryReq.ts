import axios from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const findTemporary = async (token: string, transferId: number) => {
  const res = await axios.get(`${apiUrl}/api/temporary/list`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      transferId,
    },
  });
  const temporaryList: TemporaryTransfer[] = res.data;
  const temporaryListEx: TemporaryTransfer[] = temporaryList.map(
    (temporary): TemporaryTransfer => {
      return {
        ...temporary,
        type: 'temporary',
        isChanged: false,
      };
    }
  );

  return temporaryListEx;
};

export const updateTemporary = async (temporary: TemporaryTransfer) => {
  try {
    await axios.post('/api/temporary/update', temporary);
    console.log('Success to update TemporaryTransfer');
  } catch {
    console.error('Failed to update TemporaryTransfer');
  }
};
