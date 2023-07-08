import User from '@/types/DbUser';
import axios from 'axios';
import bcrypt from 'bcryptjs';
import { headers } from 'next/dist/client/components/headers';

export const auth = async (
  event: React.FormEvent<HTMLFormElement>,
  user: User
) => {
  event.preventDefault();
  const url = 'http://localhost:8080/auth/login';
  const params = { username: user.username, password: user.password };
  console.log(params);
  let result: boolean = false;
  const headers = {
    'Content-Type': 'application/json',
  };

  try {
    const response = await axios.post(url, { ...params }, { headers });
    const token: string = response.data.token;
    console.log(token);

    const resUser = await axios.get('http://localhost:8080/api/user', {
      params: {
        username: user.username,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(resUser);
  } catch (error) {
    console.error(error);
  }
  return result;
};
