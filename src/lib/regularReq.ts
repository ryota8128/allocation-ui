import axios from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const ownApiPath = process.env.NEXT_PUBLIC_OWN_API_PATH;

export const findRegular = async (token: string) => {
  try {
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
  } catch (error) {
    // TODO: ログインし直し
    console.log('Failed to find RegularTransferList');
    return;
  }
};

export const findRegularWithApi = async () => {
  try {
    const res = await axios.get(`${ownApiPath}/api/regular/find`);
    return res.data as RegularTransfer[];
  } catch (error) {
    throw new Error('定期振替の取得に失敗しました');
  }
};

export const updateRegular = async (regular: RegularTransfer) => {
  try {
    await axios.patch(`${ownApiPath}/api/regular/update`, regular);
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
    await axios.post(`${ownApiPath}/api/regular/insert`, newRegular);
    console.log('Success to insert RegularTransfer');
  } catch (error) {
    console.log('Failed to update RegularTransfer');
    // TODO: ログインし直し
  }
};

export const deleteRegular = async (id: number) => {
  try {
    await axios.delete(`${ownApiPath}/api/regular/delete`, {
      params: {
        id,
      },
    });
    console.log('Success to delete RegularTransfer');
  } catch (error) {
    console.log('Failed to delete RegularTransfer');
    // TODO: ログイン見直し
  }
};
