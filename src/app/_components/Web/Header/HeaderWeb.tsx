import { api } from '~/trpc/server';
import HeaderLayout from './HeaderLayout';

const HeaderWeb = async () => {
  const categories = (await api.Category.getAll()) ?? [];
  return <HeaderLayout data={{ categories: categories }} />;
};

export default HeaderWeb;
