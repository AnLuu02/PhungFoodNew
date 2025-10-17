import { Box, Card, Grid, GridCol, Title } from '@mantine/core';
import Link from 'next/link';
import BButton from '~/components/Button/Button';

const LayoutGrid3Col = () => {
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

          <Title order={3} className='font-quicksand text-black' w={'70%'}>
            Hương vị tươi ngon
          </Title>
          <Title order={3} className='font-quicksand text-black' w={'70%'}>
            Món ăn 100% từ thiên nhiên
          </Title>
          <Box mt={'xs'}>
            <Link href={`/thuc-don`}>
              <BButton children={'Xem ngay'} radius='md' size='sm' w={'max-content'} />
            </Link>
          </Box>
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

          <Title order={3} className='font-quicksand text-black' w={'70%'}>
            Thức uống lành mạnh
          </Title>
          <Title order={3} className='font-quicksand text-black' w={'70%'}>
            Sữa tươi nguyên chất tiệt trùng
          </Title>

          <Box mt={'xs'}>
            <Link href={`/thuc-don?danh-muc=do-uong`}>
              <BButton children={'Xem ngay'} radius='md' size='sm' w={'max-content'} />
            </Link>
          </Box>
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

          <Title order={3} className='font-quicksand text-black' w={'70%'}>
            Ẩm thực sạch sẽ và an toàn
          </Title>
          <Title order={3} className='font-quicksand text-black' w={'70%'}>
            Chất lượng hàng đầu
          </Title>

          <Box mt={'xs'}>
            <Link href={`/thuc-don`}>
              <BButton children={'Xem ngay'} radius='md' size='sm' w={'max-content'} />
            </Link>
          </Box>
        </Card>
      </GridCol>
    </Grid>
  );
};

export default LayoutGrid3Col;
