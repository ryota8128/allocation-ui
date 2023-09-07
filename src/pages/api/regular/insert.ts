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

  let apiRes;
  try {
    apiRes = await axios.post(`${apiUrl}/api/regular`, req.body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
    return res.status(apiRes.status).json(apiRes.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // APIからのエラーレスポンスが存在する場合
      if (error.response) {
        return res.status(error.response.status).json(error.response.data);
      }
    }

    // それ以外のエラー（ネットワークエラー、タイムアウトなど）
    return res.status(500).json({ error: 'サーバーエラーが発生しました。' });
  }
}
