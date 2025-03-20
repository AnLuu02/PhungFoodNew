import { api } from '~/trpc/server';
import HeaderLayout from './HeaderLayout';

const HeaderWeb = async () => {
  const [restaurant, categories, subCategories] = await Promise.all([
    api.Restaurant.getOne(),
    api.Category.getAll(),
    api.SubCategory.getAll()
  ]);

  return <HeaderLayout data={{ restaurant: restaurant, categories: categories, subCategories: subCategories }} />;
};

export default HeaderWeb;
