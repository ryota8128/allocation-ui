import { isTokenExpired } from '@/lib/JwtUtils';
import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await getToken({ req });
  const token = user?.accessToken;

  if (!token || isTokenExpired(token)) {
    return res.status(401).json({ error: '認証が必要です' });
  }

  const apiRes = await axios.get(`${apiUrl}/api/regular/list`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const regularList: RegularTransfer[] = apiRes.data;
  const regularListEx: RegularTransfer[] = regularList.map((regular) => {
    return {
      ...regular,
      type: 'regular',
      isChanged: false,
    };
  });

  return res.status(apiRes.status).json(regularListEx);
}
