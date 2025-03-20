import { api } from '~/trpc/server';
import FooterWebLayout from './FooterLayout';
export default async function FooterWeb() {
  const restaurant = await api.Restaurant.getOne();
  return <FooterWebLayout restaurant={restaurant} />;
}
