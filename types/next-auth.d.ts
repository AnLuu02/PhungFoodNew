import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: any;
      role: any;
      permissions: any;
    } & DefaultSession['user'];
  }

  interface JWT {
    id: any;
    role: any;
    permissions: any;
  }
}
