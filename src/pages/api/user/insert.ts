import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await axios.post(`${apiUrl}/api/user/add`, req.body, {
      withCredentials: true,
    });
  } catch (error) {
    return res.status(400).json({ error: 'Bad Request' });
  }
}
