import axios from 'axios';
import { Session } from 'inspector';
import { User } from 'next-auth';
import { AdapterUser } from 'next-auth/adapters';
import { JWT } from 'next-auth/jwt';
import NextAuth from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';

export default NextAuth({
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

          const resUser = await axios.get('http://localhost:8080/api/user', {
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
          return null;
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
