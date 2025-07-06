import { Box, Card, Flex, Grid, GridCol, rem, Text } from '@mantine/core';
import Image from 'next/image';

const serviceData = [
  {
    icon: '/images/webp/car.webp',
    title: 'Vận chuyển miễn phí',
    description: 'Hóa đơn trên 5 triệu'
  },
  {
    icon: '/images/webp/stock.webp',
    title: 'Đổi trả miễn phí',
    description: 'Trong vòng 7 ngày'
  },
  {
    icon: '/images/webp/bill.webp',
    title: '100% Hoàn tiền',
    description: 'Nếu sản phẩm lỗi'
  },
  {
    icon: '/images/webp/hotline.webp',
    title: 'Hỗ trợ 24/7',
    description: 'webp/hotline: 1900 6750'
  }
];
const ServiceComponent = () => {
  return (
    <Grid py={rem(50)}>
      {serviceData.map((service, index) => (
        <GridCol span={{ base: 12, xs: 6, xl: 3 }}>
          <Card radius={'lg'} className='dark:bg-dark-card bg-gray-100' py='xs'>
            <Flex align={'center'} justify={'center'} w={'100%'}>
              <Box mr={20}>
                <Image
                  loading='lazy'
                  src={service.icon}
                  width={40}
                  height={40}
                  alt={'empty'}
                  style={{ objectFit: 'cover' }}
                />
              </Box>
              <Flex direction={'column'} align='flex-start'>
                <Text size='md' className='text-mainColor' fw={700}>
                  {service.title}
                </Text>
                <Text size='sm'>{service.description}</Text>
              </Flex>
            </Flex>
          </Card>
        </GridCol>
      ))}
    </Grid>
  );
};

export default ServiceComponent;
