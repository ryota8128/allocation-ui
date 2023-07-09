import axios from 'axios';
import { User } from 'next-auth';
import NextAuth from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';

export default NextAuth({
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      type: "credentials",
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        if (!credentials || !credentials.username || !credentials?.password) {
          return null;
        }
        const username = credentials.username;

        const password = credentials.password;
        try {
          const resLogin = await axios.post(
            'http://localhost:8080/auth/login',
            {
              username,
              password,
            }
          );
          const token = resLogin.data.token;
          console.log(token);

          const resUser = await axios.get('http://localhost:8080/api/user', {
            params: {
              username,
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const loginUser: User = {
            id: resUser.data.id.toString(),
            name: resUser.data.username,
            email: resUser.data.email,
          };

          console.log(loginUser);

          return loginUser;
        } catch (error) {
          return null;
        }
      },
    }),
  ],
});
