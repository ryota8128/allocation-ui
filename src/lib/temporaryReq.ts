import axios from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const findTemporary = async (token: string) => {
  const res = await axios.get(`${apiUrl}/api/temporary/list`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const temporaryList: TemporaryTransfer[] = res.data;
  const temporaryListWithType: TemporaryTransfer[] = temporaryList.map(
    (temporary): TemporaryTransfer => {
      return {
        ...temporary,
        type: 'temporary',
      };
    }
  );

  return temporaryListWithType;
};

export const updateTemporary = async (
  token: string,
  temporary: TemporaryTransfer
) => {
  try {
    await axios.patch(`${apiUrl}/api/temporary`, temporary, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    console.log('update temporary success');
  } catch {
    console.error('update temporary error');
  }
};
