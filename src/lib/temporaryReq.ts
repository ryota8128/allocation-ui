import axios from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const findTemporary = async (token: string) => {
  const res = await axios.get(`${apiUrl}/api/temporary/list`, {
    headers: {
      Authorization: `Bearer ${token}`,
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

export const updateTemporary = async (
  token: string,
  temporary: TemporaryTransfer
) => {
  try {
    await axios.post('/api/temporary/update', temporary);
    console.log('update temporary success');
  } catch {
    console.error('update temporary error');
  }
};
