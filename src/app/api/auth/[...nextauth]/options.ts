import { compare } from 'bcryptjs';
import { randomBytes } from 'crypto';
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { checkIfLocked, handleFailedLogin, unlockIfExpired } from '~/lib/FuncHandler/HandleLockedUser/userLockService';
import { api } from '~/trpc/server';

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt'
  },
  providers: [
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
      async authorize(credentials) {
        const { email, password } = credentials as { email: string; password: string };
        const user = await api.User.getOne({ s: email || '' });
        if (!user) {
          throw new Error('Tài khoản không tồn tại.');
        }
        await unlockIfExpired(user);
        const refreshed = await api.User.getOne({ s: email });
        checkIfLocked(refreshed);

        const isValid = await compare(password, refreshed.password);
        if (!isValid) await handleFailedLogin(refreshed);

        if (!refreshed.isActive || !refreshed.isVerified)
          throw new Error('Tài khoản của bạn hiện đang bị vô hiệu hóa.');

        await api.User.updateCustom({
          where: { email },
          data: { isLocked: false, failedAttempts: 0, lockedUntil: null }
        });

        return {
          id: user?.id,
          name: user?.name,
          email: user?.email,
          image: user?.image?.url,
          role: user?.role?.name,
          permissions: user?.role?.permissions.map(p => p.name)
        };
      }
    })
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      if (url.startsWith(baseUrl)) return url;
      return baseUrl;
    },
    async signIn({ user }) {
      try {
        if (!user?.email) return false;
        const { email } = user;
        let userFromDb = await api.User.getOne({ s: email });

        if (userFromDb?.isLocked && !(await unlockIfExpired(userFromDb))) return '/error?reason=locked';

        if (!userFromDb) {
          const randomPass = randomBytes(8).toString('hex');
          await api.User.create({
            email: user.email,
            name: user.name ?? '',
            password: randomPass,
            image: user.image ? { fileName: user.image, base64: '' } : { fileName: '', base64: '' },
            phone: ''
          });
        }
        return true;
      } catch (error) {
        console.error('Error in signIn callback:', error);
        return '/error?reason=locked';
      }
    },

    async jwt({ token }) {
      try {
        const userFromDb = await api.User.getOne({ s: token?.email || '' });

        if (userFromDb?.id) {
          token.role = userFromDb?.role?.name;
          token.id = userFromDb?.id;
          token.permissions = userFromDb?.role?.permissions.map(p => p.name);
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
        session.user.permissions = token.permissions;
      }
      return session;
    }
  }
};
