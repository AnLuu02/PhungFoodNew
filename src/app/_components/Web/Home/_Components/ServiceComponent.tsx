'use client';
import { Card, Flex, Grid, GridCol, Image, rem, Text } from '@mantine/core';
import { usePathname } from 'next/navigation';
import { noHeadersLayoutCondition } from '~/app/lib/utils/constants/no-headers-layout-condition';
const ServiceComponent = () => {
  const pathname = usePathname();
  return (
    noHeadersLayoutCondition.every(path => !pathname.includes(path)) && (
      <Grid py={rem(50)}>
        <GridCol span={{ base: 12, xs: 6, xl: 3 }}>
          <Card radius={'lg'} bg={'gray.1'} py='xs'>
            <Flex align={'center'} justify={'center'} w={'100%'}>
              <Image loading='lazy' src={'/images/webp/car.webp'} w={40} h={40} alt={'empty'} mr={20} />
              <Flex direction={'column'} align='flex-start'>
                <Text size='md' c={'green.9'} fw={700}>
                  Vận chuyển miễn phí
                </Text>
                <Text size='sm' c={'black'}>
                  Hóa đơn trên 5 triệu
                </Text>
              </Flex>
            </Flex>
          </Card>
        </GridCol>
        <GridCol span={{ base: 12, xs: 6, xl: 3 }}>
          <Card radius={'lg'} bg={'gray.1'} py='xs'>
            <Flex align={'center'} justify={'center'} w={'100%'}>
              <Image loading='lazy' src={'/images/webp/stock.webp'} w={40} h={40} alt={'empty'} mr={20} />
              <Flex direction={'column'} align='flex-start'>
                <Text size='md' c={'green.9'} fw={700}>
                  Đổi trả miễn phí
                </Text>
                <Text size='sm' c={'black'}>
                  Trong vòng 7 ngày
                </Text>
              </Flex>
            </Flex>
          </Card>
        </GridCol>
        <GridCol span={{ base: 12, xs: 6, xl: 3 }}>
          <Card radius={'lg'} bg={'gray.1'} py='xs'>
            <Flex align={'center'} justify={'center'} w={'100%'}>
              <Image loading='lazy' src={'/images/webp/bill.webp'} w={40} h={40} alt={'empty'} mr={20} />
              <Flex direction={'column'} align='flex-start'>
                <Text size='md' c={'green.9'} fw={700}>
                  100% Hoàn tiền
                </Text>
                <Text size='sm' c={'black'}>
                  Nếu sản phẩm lỗi
                </Text>
              </Flex>
            </Flex>
          </Card>
        </GridCol>
        <GridCol span={{ base: 12, xs: 6, xl: 3 }}>
          <Card radius={'lg'} bg={'gray.1'} py='xs'>
            <Flex align={'center'} justify={'center'} w={'100%'}>
              <Image loading='lazy' src={'/images/webp/hotline.webp'} w={40} h={40} alt={'empty'} mr={20} />
              <Flex direction={'column'} align='flex-start'>
                <Text size='md' c={'green.9'} fw={700}>
                  webp/hotline: 1900 6750
                </Text>
                <Text size='sm' c={'black'}>
                  Hỗ trợ 24/7
                </Text>
              </Flex>
            </Flex>
          </Card>
        </GridCol>
      </Grid>
    )
  );
};

export default ServiceComponent;
