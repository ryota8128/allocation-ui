import User from '@/types/DbUser';
import axios from 'axios';
import bcrypt from 'bcryptjs';

export const auth = async (
  event: React.FormEvent<HTMLFormElement>,
  user: User
) => {
  event.preventDefault();
  const url = 'http://localhost:8080/api/user';
  const params = { username: user.username };
  let result: boolean = false;

  try {
    const response = await axios.get(url, { params });
    const findUser: User = response.data;
    result = await bcrypt.compare(user.password, findUser.password);
    console.log(findUser);
  } catch (error) {
    console.error(error);
  }
  return result;
};
