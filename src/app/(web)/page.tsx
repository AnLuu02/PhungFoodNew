import { Metadata } from 'next';
import HomeWeb from '~/components/Web/Home/HomeWeb';
import { api } from '~/trpc/server';
export const metadata: Metadata = {
  title: 'Phụng Food - Đặc sản miền Tây chính gốc Cà Mau, Long An',
  description: 'Phụng Food chuyên cung cấp món ăn truyền thống miền Tây, đặc sản Cà Mau và Long An, giao hàng tận nơi.'
};

const HomePage = async () => {
  const data = await api.Page.getInit();
  return <HomeWeb data={data} />;
};

export default HomePage;
