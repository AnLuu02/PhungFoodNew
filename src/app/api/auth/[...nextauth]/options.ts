import { compare } from 'bcryptjs';
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import { api } from '~/trpc/server';

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt'
  },
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'email', type: 'text', placeholder: 'jsmith' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Vui lòng nhập đầy đủ email và mật khẩu.');
        }

        const user = await api.User.getOne({ query: credentials?.email || '' });
        if (!user) {
          throw new Error('Tài khoản không tồn tại.');
        }
        const isValid = await compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error('Mật khẩu không đúng.');
        }
        return {
          id: user?.id,
          name: user?.name,
          email: user?.email,
          image: user?.images?.[0]?.url,
          role: user?.role
        };
      }
    })
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
    async signIn({ user, account, profile }) {
      try {
        if (user.email) {
          const { email, name, image } = user;
          await api.User.create({
            email: email || '',
            name: name || '',
            password: 'default123',
            image: { fileName: image || '', base64: '' }
          });
        }
        return true;
      } catch (error) {
        console.error('Error in signIn callback:', error);
        return false;
      }
    },
    async jwt({ token }) {
      try {
        const userFromDb = await api.User.getOne({ query: token?.email || '' });

        if (userFromDb) {
          token.role = userFromDb?.role;
          token.id = userFromDb?.id;
          token.details = {
            id: userFromDb?.id,
            name: userFromDb?.name,
            email: userFromDb?.email
          };
        }
      } catch (error) {
        console.error('Error in jwt callback:', error);
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role;
        session.user.id = token.id;
        session.user.details = token.details;
      }
      return session;
    }
  },
  pages: {
    signIn: '/dang-nhap'
  }
};
