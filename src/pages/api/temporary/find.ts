import { isTokenExpired } from '@/lib/JwtUtils';
import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await getToken({ req });
  const token = user?.accessToken;
  const transferId = req.query.transferId;

  if (!token || isTokenExpired(token)) {
    return res.status(401).json({ error: '認証が必要です' });
  }

  if (!transferId) {
    res.status(403).json({ error: 'パラメータが不十分です' });
  }

  const apiRes = await axios.get(`${apiUrl}/api/temporary/list?transferId=${transferId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const temporaryList: TemporaryTransfer[] = apiRes.data;
  const temporaryListEx: TemporaryTransfer[] = temporaryList.map((temporary) => {
    return {
      ...temporary,
      type: 'temporary',
      isChanged: false,
    };
  });

  return res.status(apiRes.status).json(temporaryListEx);
}
