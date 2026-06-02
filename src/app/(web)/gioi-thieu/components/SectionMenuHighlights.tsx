import { Box, Button, Card, Group, SimpleGrid, Text } from '@mantine/core';
import { ImageType } from '@prisma/client';
import { IconArrowRight } from '@tabler/icons-react';
import Image from 'next/image';
import Link from 'next/link';
import Reveal from '~/components/Reveal';
import { getImageProduct } from '~/lib/FuncHandler/getImageProduct';
import { GetInitAboutUs } from '~/shared/type-trpc/page.type-trpc';
import { SectionHeading } from './SectionHeading';
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

          <Button
            component={Link}
            href='/thuc-don'
            radius='xl'
            rightSection={<IconArrowRight size={17} />}
            visibleFrom='md'
          >
            Xem tất cả món
          </Button>
        </Group>

        <SimpleGrid cols={{ base: 1, md: 3 }} spacing='xl'>
          {products &&
            products.map(item => (
              <Card
                key={item.name}
                radius={32}
                p={10}
                className='group overflow-hidden border bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-2xl dark:bg-dark-card'
              >
                <Box className='relative h-[260px] overflow-hidden rounded-[26px]'>
                  <Image
                    src={
                      getImageProduct(item?.imageForEntities || [], ImageType.THUMBNAIL) ||
                      '/images/jpg/empty-300x240.jpg'
                    }
                    alt={item.name}
                    fill
                    className='object-cover transition duration-500 group-hover:scale-110'
                  />
                  <Box className='absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent' />
                  <Text className='absolute bottom-4 left-4 right-4 font-quicksand text-2xl font-black text-white'>
                    {item.name}
                  </Text>
                </Box>

                <Box p='md'>
                  <Text c='dimmed' className='leading-7'>
                    {item.description || 'Đang cập nhật'}
                  </Text>

                  <Button component={Link} href='/thuc-don' mt='md' radius='xl' variant='light' fullWidth>
                    Đặt món này
                  </Button>
                </Box>
              </Card>
            ))}
        </SimpleGrid>
      </Box>
    </Reveal>
  );
};
