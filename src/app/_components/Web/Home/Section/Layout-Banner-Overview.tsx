import { Box, Card, Flex, Image, Text, Title } from '@mantine/core';
import Link from 'next/link';
import BButton from '~/app/_components/Button';

const LayoutBannerOverview = () => {
  return (
    <Card
      radius={'md'}
      pos='relative'
      h='80vh'
      w='100%'
      p={0}
      className="hidden bg-[url('/logo/bg.jpg')] bg-cover bg-center bg-no-repeat sm:block"
    >
      <Box pos='absolute' left={0} top={0} h='100%' w='100%' bg='black' opacity={0.5} />
      <Flex direction='column' pos='absolute' top='50%' className='-translate-y-1/2 transform' c='white' w='100%'>
        <Flex direction={{ base: 'column', md: 'row' }} align='center' px={'md'}>
          <Box w={{ base: '100%', md: '50%' }}>
            <Image
              loading='lazy'
              src='/images/temp/ot hiem.png'
              className='animate-wiggle'
              alt='Jollibee Logo'
              w={{ base: 300, md: 500 }}
              h={{ base: 300, md: 500 }}
            />
          </Box>
          <Flex direction='column' w={{ base: '100%', md: '50%' }}>
            <Flex align='center' mb='md'>
              <Title order={1} fw={900} className='font-quicksand text-[40px]'>
                Sự khác biệt
              </Title>
              <Image
                loading='lazy'
                src='/images/temp/leaves.png'
                alt='Leaves'
                w={80}
                h={80}
                className='animate-wiggle'
              />
            </Flex>
            <Text size='lg' mb='lg'>
              Ở Phụng Food, sốt ướp thịt là một trong những yếu tố quan trọng nhất quyết định vị ngon của thịt nướng.
              Đối với các loại thịt bò, bạn có thể chọn ướp muối để tôn lên vị tự nhiên của thịt, hoặc ướp sốt Phụng
              Food để cảm nhận vị đậm đà, thơm ngon.
            </Text>
            <Link href='/thuc-don' className='w-full'>
              <BButton title={'Chọn món'} size='lg' radius='xl' w={150} />
            </Link>
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );
};

export default LayoutBannerOverview;
