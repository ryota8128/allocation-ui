import { isTokenExpired } from '@/lib/ JwtUtils';
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

  if (!req.query.title) {
    return res.status(403).json({ error: 'パラメータ:name が存在しません' });
  }

  try {
    const apiRes = await axios.get(`${apiUrl}/api/transfer`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        title: req.query.title,
      },
    });
    return res.status(apiRes.status).json(apiRes.data);
  } catch (error) {
    return res.status(401).json({ error: '認証に失敗しました' });
  }
}
