import { Badge, Box, Button, Card, Group, Image, Rating, Stack, Text, Title } from '@mantine/core';
import { IconShoppingBag } from '@tabler/icons-react';
import Link from 'next/link';
import { formatPriceLocaleVi } from '~/lib/FuncHandler/Format';

type OfferProduct = {
  id: string | number;
  image: string;
  name: string;
  price: number;
  oldPrice?: number | null;
  rating?: number;
  sold: number;
  tag?: string;
};

export const CardFeaturedOffer = ({ bestDeal }: { bestDeal: OfferProduct }) => {
  const hasDiscount = Boolean(bestDeal.oldPrice && bestDeal.oldPrice > bestDeal.price);

  const discountAmount = hasDiscount ? bestDeal.oldPrice! - bestDeal.price : 0;
  const percentDiscount = hasDiscount ? (discountAmount / bestDeal.oldPrice!) * 100 : 0;

  const discountText =
    percentDiscount < 10 ? `Giảm ${formatPriceLocaleVi(discountAmount)}` : `Giảm ${percentDiscount.toFixed(0)}%`;

  return (
    <Card
      p={0}
      className='relative animate-scaleIn overflow-hidden rounded-[24px] border border-white/15 bg-white/10 shadow-2xl backdrop-blur-xl sm:rounded-[30px] md:rounded-[36px]'
    >
      <Box
        className={`absolute -right-16 -top-16 h-40 w-40 rounded-full blur-3xl ${
          hasDiscount ? 'bg-red-500/30' : 'bg-orange-400/25'
        }`}
      />
      <Box className='absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-yellow-300/20 blur-3xl' />

      <Box className='relative overflow-hidden rounded-[24px] bg-slate-950 text-white sm:rounded-[30px] md:rounded-[36px]'>
        <Box className='relative h-[430px] overflow-hidden sm:h-[390px] md:h-[360px]'>
          <Image
            src={bestDeal.image}
            alt={bestDeal.name}
            className='h-full w-full object-cover transition duration-700 hover:scale-110'
          />

          <Box className='absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-transparent' />
          <Box className='absolute inset-0 bg-gradient-to-r from-slate-950/60 via-transparent to-transparent' />

          <Badge
            size='md'
            radius='xl'
            className={`absolute left-4 top-4 px-3 py-2 text-xs shadow-lg backdrop-blur-md sm:left-5 sm:top-5 sm:text-sm ${
              hasDiscount ? 'bg-red-600 text-white' : 'bg-white/90 text-slate-950'
            }`}
          >
            {hasDiscount ? `Chỉ hôm nay · ${discountText}` : 'Món được yêu thích'}
          </Badge>

          <Rating
            className='pointer-events-none absolute right-4 top-4 sm:right-5 sm:top-5'
            value={bestDeal?.rating || 5}
            classNames={{
              root: 'text-xs text-subColor sm:text-sm md:text-lg'
            }}
          />

          <Stack className='absolute bottom-0 left-0 right-0 p-4 sm:p-5 md:p-6' gap='md'>
            <Box>
              <Text size='xs' fw={800} className='mb-1 uppercase tracking-[0.18em] text-orange-300 sm:text-sm'>
                {hasDiscount ? 'Ưu đãi nổi bật' : 'Gợi ý hôm nay'}
              </Text>

              <Title
                order={2}
                className='line-clamp-2 font-quicksand text-2xl font-black leading-tight text-white sm:text-3xl'
              >
                {bestDeal.name}
              </Title>

              <Text size='sm' className='mt-2 line-clamp-2 max-w-full text-white/75 sm:max-w-[90%]'>
                {hasDiscount
                  ? 'Món ngon được săn nhiều nhất hôm nay — giá tốt, số lượng có hạn.'
                  : 'Món ăn được nhiều khách lựa chọn, hương vị dễ ăn và phù hợp cho mọi bữa.'}
              </Text>
            </Box>

            <Group justify='space-between' align='end' gap='md' wrap='wrap'>
              <Box className='min-w-0 flex-1'>
                <Group gap='xs' align='end' wrap='wrap'>
                  <Text className='font-quicksand text-3xl font-black text-orange-300 sm:text-4xl'>
                    {formatPriceLocaleVi(bestDeal.price)}
                  </Text>

                  {hasDiscount && (
                    <Text td='line-through' fw={700} className='pb-1 text-sm text-white/45 sm:text-base'>
                      {formatPriceLocaleVi(bestDeal?.oldPrice || 0)}
                    </Text>
                  )}
                </Group>

                <Text size='xs' className='mt-1 line-clamp-1 text-white/50'>
                  {hasDiscount
                    ? 'Áp dụng khi đặt hàng trong hôm nay'
                    : bestDeal.sold
                      ? `Đã bán ${bestDeal.sold}+ phần`
                      : 'Luôn sẵn sàng cho đơn hàng của bạn'}
                </Text>
              </Box>

              <Button
                component={Link}
                href={`/thuc-don/${bestDeal.tag}`}
                radius='xl'
                size='md'
                className='w-full sm:w-auto'
                rightSection={<IconShoppingBag size={18} />}
              >
                {hasDiscount ? 'Đặt ngay' : 'Xem món'}
              </Button>
            </Group>
          </Stack>
        </Box>
      </Box>
    </Card>
  );
};
