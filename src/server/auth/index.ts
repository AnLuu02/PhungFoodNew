import { getServerSession } from 'next-auth';
import { authOptions } from './options';

export const getServerAuthSession = () => {
  return getServerSession(authOptions);
};
