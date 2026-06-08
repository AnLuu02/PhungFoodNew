import { Box, Button, Group, SimpleGrid } from '@mantine/core';
import { ImageType } from '@prisma/client';
import { IconArrowRight } from '@tabler/icons-react';
import Link from 'next/link';
import Reveal from '~/components/Reveal';
import { CardFeaturedOffer } from '~/components/Web/Card/CardFeaturedOffer';
import { getImageProduct } from '~/lib/FuncHandler/getImageProduct';
import { GetInitAboutUs } from '~/shared/type-trpc/page.type-trpc';
import { SectionHeading } from '../../../../components/SectionHeading';
const menuHighlights = [
  {
    name: 'Burger bò sốt tiêu miền Tây',
    desc: 'Bò mềm, sốt tiêu đậm vị, rau tươi và bánh nóng.',
    image: '/images/png/delicious-burger-fries.png'
  },
  {
    name: 'Gà giòn mật ong cay',
    desc: 'Lớp vỏ giòn, sốt mật ong cay nhẹ, rất hợp ăn cùng khoai.',
    image: '/images/jpg/cooking-1.jpg'
  },
  {
    name: 'Combo gia đình',
    desc: 'Phần ăn đầy đủ, tiết kiệm, phù hợp cho nhóm bạn hoặc gia đình.',
    image: '/images/jpg/cooking-2.jpg'
  }
];

export const SectionMenuHighlights = ({
  productsPagination
}: {
  productsPagination: GetInitAboutUs['productBestSaler'];
}) => {
  const products = productsPagination.products || [];
  return (
    <Reveal z={40}>
      <Box>
        <Group justify='space-between' align='end' mb={32}>
          <SectionHeading
            index='05'
            title='Những món khiến khách nhớ đến'
            description='Một vài lựa chọn nổi bật giúp khách mới dễ bắt đầu và khách cũ luôn có lý do quay lại.'
          />

          <Button component={Link} href='/thuc-don' rightSection={<IconArrowRight size={17} />} visibleFrom='md'>
            Xem tất cả món
          </Button>
        </Group>

        <SimpleGrid cols={{ base: 1, md: 2 }} spacing='xl'>
          {products &&
            products.slice(0, 2).map(item => (
              <CardFeaturedOffer
                bestDeal={{
                  id: item.id,
                  image:
                    getImageProduct(item?.imageForEntities || [], ImageType.THUMBNAIL) ||
                    '/images/jpg/empty-300x240.jpg',
                  name: item.name ?? 'Đang cập nhật',
                  price: (item?.price || 0) - (item?.discount || 0),
                  oldPrice: item?.price ?? 0,
                  sold: item?.soldQuantity ?? 0,
                  tag: item?.tag ?? 'Đang cập nhật'
                }}
              />
            ))}
        </SimpleGrid>
      </Box>
    </Reveal>
  );
};
