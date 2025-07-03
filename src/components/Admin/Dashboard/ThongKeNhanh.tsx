'use client';

import { SimpleGrid } from '@mantine/core';
import {
  IconBrandStocktwits,
  IconCardboards,
  IconCategory,
  IconCategory2,
  IconImageInPicture,
  IconMeat,
  IconShoppingCart,
  IconStar,
  IconTicket,
  IconUser,
  IconUsers
} from '@tabler/icons-react';
import CardWithIcon from '../CartWithIcon';

const ThongKeNhanh = ({ data }: any) => {
  const { category, payment, users, orders, materials, products, vouchers, reviews, subCategories, images, roles } =
    data;
  return (
    <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }}>
      <CardWithIcon
        icon={IconCategory}
        title='Danh mục'
        href='category'
        value={category?.length?.toString() || '0'}
        diff={12}
      />
      <CardWithIcon
        icon={IconCardboards}
        href='payment'
        title='Thanh toán'
        value={payment?.length?.toString() || '0'}
        diff={-2}
      />
      <CardWithIcon icon={IconUsers} title='Người dùng' href='user' value={users?.length?.toString() || '0'} diff={7} />
      <CardWithIcon
        icon={IconShoppingCart}
        href='order'
        title='Đơn hàng'
        value={orders?.length?.toString() || '0'}
        diff={5}
      />
      <CardWithIcon
        icon={IconBrandStocktwits}
        href='product'
        title='Sản phẩm'
        value={products?.length?.toString() || '0'}
        diff={5}
      />
      <CardWithIcon
        icon={IconMeat}
        title='Nguyên liệu'
        href='material'
        value={materials?.length?.toString() || '0'}
        diff={5}
      />
      <CardWithIcon
        icon={IconTicket}
        title='Khuyến mãi'
        href='voucher'
        value={vouchers?.length?.toString() || '0'}
        diff={5}
      />
      <CardWithIcon
        icon={IconStar}
        title='Đánh giá'
        href='review'
        value={reviews?.length?.toString() || '0'}
        diff={5}
      />
      <CardWithIcon
        icon={IconCategory2}
        title='Danh mục con'
        href='subCategory'
        value={subCategories?.length?.toString() || '0'}
        diff={5}
      />
      <CardWithIcon
        icon={IconImageInPicture}
        title='Ảnh'
        href='image'
        value={images?.length?.toString() || '0'}
        diff={5}
      />
      <CardWithIcon icon={IconUser} title='Vai trò' href='role' value={roles?.length?.toString() || '0'} diff={5} />
    </SimpleGrid>
  );
};

export default ThongKeNhanh;
