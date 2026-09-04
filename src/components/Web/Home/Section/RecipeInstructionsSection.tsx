import cooking_guilds from '~/lib/HardData/cooking_guilds.json';
import CardRecipe from '../../Card/CardRecipe';
import { CarouselListBase } from '../components/CarouselListBase';

export const RecipeInstructionsSection = async () => {
  const recipes = cooking_guilds;
  return (
    <>
      <CarouselListBase
        title='Video hướng dẫn'
        data={recipes}
        configs={{
          slideSize: { base: Boolean(recipes?.length > 1) ? '70%' : '100%', sm: '50%', md: '25%' },
          h: 'max-content'
        }}
        navigation={{
          href: '/',
          label: 'Xem tất cả'
        }}
        CardElement={CardRecipe}
      />
    </>
  );
};
