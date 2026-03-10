import { Gender, UserLevel } from '@prisma/client';
import { compare } from 'bcryptjs';
import { randomBytes } from 'crypto';
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { db } from '../db';
import {
  createUserService,
  getOneUserService,
  handleFailedLogin,
  handleUserLock,
  updateUserCustomService
} from '../services/user.service';

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
        const user = await getOneUserService(db, { s: email || '' });
        if (!user) {
          throw new Error('Người dùng không tồn tại.');
        }
        const refreshed = await handleUserLock(user);

        const isValid = await compare(password, refreshed.password);
        if (!isValid) await handleFailedLogin(refreshed);
        if (!refreshed.isActive) throw new Error('Tài khoản của bạn hiện đang bị vô hiệu hóa.');
        if (!refreshed.isVerified)
          throw new Error(
            'Tài khoản của bạn chưa kích hoạt. VUI LÒNG ẤN QUÊN -/ QUÊN MẬT KHẨU /- ĐỂ TIẾN HÀNH KÍCH HOẠT.'
          );
        await updateUserCustomService(db, {
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
        const { email, image, name } = user;

        let userFromDb = await getOneUserService(db, { s: email });
        if (!userFromDb) {
          const randomPass = randomBytes(8).toString('hex');
          await createUserService(
            db,
            {
              email,
              name: name ?? '',
              isActive: true,
              gender: Gender.OTHER,
              pointUser: 0,
              level: UserLevel.BRONZE,
              password: randomPass,
              image: image ? { fileName: image, base64: '' } : undefined,
              phone: ''
            },
            null
          );
        }
        if (!userFromDb?.image && image) {
          await updateUserCustomService(db, {
            where: { email },
            data: {
              name: userFromDb?.name || 'Khách hàng',
              image: { fileName: image, base64: '' }
            }
          });
        }

        if (userFromDb?.isLocked && !(await handleUserLock(userFromDb))) return '/error?reason=locked';

        return true;
      } catch (error) {
        console.error('Error in signIn callback:', error);
        return '/error?reason=locked';
      }
    },

    async jwt({ token }) {
      try {
        const userFromDb = await getOneUserService(db, { s: token?.email || '' });
        if (userFromDb?.id) {
          token.role = userFromDb?.role?.name;
          token.id = userFromDb?.id;
          token.picture = userFromDb?.image?.url;
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
        session.user.image = token.picture;
        session.user.email = token.email;
        session.user.permissions = token.permissions;
      }
      return session;
    }
  }
};
