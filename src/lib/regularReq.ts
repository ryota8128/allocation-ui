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
  return regularListEx
};

export const updateRegular = async (
  token: string,
  regular: RegularTransfer
) => {
  try {
    await axios.patch(`${apiUrl}/api/regular`, regular, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    console.log('update regular success');
  } catch (error) {
    console.error('update regular error');
  }
};
