import axios from 'axios';
import { User } from 'next-auth';
import NextAuth from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default NextAuth({
  pages: {
    error: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      type: 'credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        if (!credentials || !credentials.username || !credentials?.password) {
          throw new Error('invalidForm');
        }

        const username = credentials.username;
        const password = credentials.password;
        const loginUrl = `${apiUrl}/auth/login`;
        try {
          const resLogin = await axios.post(loginUrl, {
            username,
            password,
          });
          const token = resLogin.data.token;
          const userGetUrl = `${apiUrl}/api/user/`;

          const resUser = await axios.get(userGetUrl, {
            params: {
              username,
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const user: User = {
            id: resUser.data.id.toString(),
            name: resUser.data.username,
            email: resUser.data.email,
            token: token,
          };

          return user;
        } catch (error) {
          throw new Error('failed');
        }
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user, account }) => {
      // 最初のサインイン
      if (account && user) {
        return {
          ...token,
          accessToken: user.token,
        };
      }

      return token;
    },

    session: async ({ session, token }) => {
      session.user = {
        id: token.id,
        name: token.name,
        email: token.email,
      };
      session.accessToken = token.accessToken;
      return session;
    },
  },
});
