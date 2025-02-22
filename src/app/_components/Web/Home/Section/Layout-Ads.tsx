'use client';
import { Box, Card, Grid, GridCol, Title } from '@mantine/core';
import BButton from '~/app/_components/Button';

const LayoutAds = () => {
  return (
    <Grid>
      <GridCol span={{ base: 12, xs: 6, xl: 4 }}>
        <Card
          radius={'lg'}
          className='relative bg-[url(/images/webp/img_3banner_1.webp)] bg-cover bg-no-repeat'
          h={238}
          w={'100%'}
          p={'xl'}
        >
          <Box pos='absolute' className='z-[-1]' left={0} top={0} h='100%' w='100%' bg='black' opacity={0.2} />

          <Title order={3} c={'black'} className='font-quicksand' mb={'xs'} w={'70%'}>
            Nông sản tươi mới Sản phẩm 100% từ Thiên nhiên
          </Title>

          <BButton title={'Xem ngay'} radius='md' size='sm' w={'max-content'} />
        </Card>
      </GridCol>
      <GridCol span={{ base: 12, xs: 6, xl: 4 }}>
        <Card
          radius={'lg'}
          className='relative bg-[url(/images/webp/img_3banner_2.webp)] bg-cover bg-no-repeat'
          h={238}
          w={'100%'}
          p={'xl'}
        >
          <Box pos='absolute' className='z-[-1]' left={0} top={0} h='100%' w='100%' bg='black' opacity={0.2} />

          <Title order={3} c={'black'} className='font-quicksand' mb={'xs'} w={'70%'}>
            Bữa sáng lành mạnh Sữa tươi nguyên chất Tiệt trùng
          </Title>

          <BButton title={'Xem ngay'} radius='md' size='sm' w={'max-content'} />
        </Card>
      </GridCol>
      <GridCol span={{ base: 12, xs: 6, xl: 4 }}>
        <Card
          radius={'lg'}
          className='relative bg-[url(/images/webp/img_3banner_3.webp)] bg-cover bg-no-repeat'
          h={238}
          w={'100%'}
          p={'xl'}
        >
          <Box pos='absolute' className='z-[-1]' left={0} top={0} h='100%' w='100%' bg='black' opacity={0.2} />

          <Title order={3} c={'black'} className='font-quicksand' mb={'xs'} w={'70%'}>
            Thực phẩm 100% Sạch sẻ và an toàn Chất lượng
          </Title>

          <BButton title={'Xem ngay'} radius='md' size='sm' w={'max-content'} />
        </Card>
      </GridCol>
    </Grid>
  );
};

export default LayoutAds;
