import axios from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const findTemporary = async (token: string, transferId: number) => {
  try {
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
  } catch (error) {
    console.log('Failed to find TemporaryTransferList');
    // TODO: ログインし直し
  }
};

export const updateTemporary = async (temporary: TemporaryTransfer) => {
  try {
    await axios.post('/api/temporary/update', temporary);
    console.log('Success to update TemporaryTransfer');
  } catch {
    console.error('Failed to update TemporaryTransfer');
    // TODO: ログインし直し
  }
};

export const insertTemporary = async (transferId: number) => {
  const newTemporary: TemporaryTransfer = {
    transferId,
    amount: 0,
  };
  try {
    await axios.post('api/temporary/insert', newTemporary);
    console.log('Success to insert TemporaryTransfer');
  } catch (error) {
    console.log('Failed to update TemporaryTransfer');
    // TODO: ログインし直し
  }
};
