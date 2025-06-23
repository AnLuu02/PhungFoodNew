'use client';
import { Box, Card, Flex, Grid, GridCol, rem, Text } from '@mantine/core';
import Image from 'next/image';
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
              <Box mr={20}>
                <Image loading='lazy' src={'/images/webp/car.webp'} width={40} height={40} alt={'empty'} />
              </Box>
              <Flex direction={'column'} align='flex-start'>
                <Text size='md' c={'green.9'} fw={700}>
                  Vận chuyển miễn phí
                </Text>
                <Text size='sm'>Hóa đơn trên 5 triệu</Text>
              </Flex>
            </Flex>
          </Card>
        </GridCol>
        <GridCol span={{ base: 12, xs: 6, xl: 3 }}>
          <Card radius={'lg'} bg={'gray.1'} py='xs'>
            <Flex align={'center'} justify={'center'} w={'100%'}>
              <Box mr={20}>
                <Image loading='lazy' src={'/images/webp/stock.webp'} width={40} height={40} alt={'empty'} />
              </Box>
              <Flex direction={'column'} align='flex-start'>
                <Text size='md' c={'green.9'} fw={700}>
                  Đổi trả miễn phí
                </Text>
                <Text size='sm'>Trong vòng 7 ngày</Text>
              </Flex>
            </Flex>
          </Card>
        </GridCol>
        <GridCol span={{ base: 12, xs: 6, xl: 3 }}>
          <Card radius={'lg'} bg={'gray.1'} py='xs'>
            <Flex align={'center'} justify={'center'} w={'100%'}>
              <Box mr={20}>
                <Image loading='lazy' src={'/images/webp/bill.webp'} width={40} height={40} alt={'empty'} />
              </Box>
              <Flex direction={'column'} align='flex-start'>
                <Text size='md' c={'green.9'} fw={700}>
                  100% Hoàn tiền
                </Text>
                <Text size='sm'>Nếu sản phẩm lỗi</Text>
              </Flex>
            </Flex>
          </Card>
        </GridCol>
        <GridCol span={{ base: 12, xs: 6, xl: 3 }}>
          <Card radius={'lg'} bg={'gray.1'} py='xs'>
            <Flex align={'center'} justify={'center'} w={'100%'}>
              <Box mr={20}>
                <Image loading='lazy' src={'/images/webp/hotline.webp'} width={40} height={40} alt={'empty'} />
              </Box>
              <Flex direction={'column'} align='flex-start'>
                <Text size='md' c={'green.9'} fw={700}>
                  webp/hotline: 1900 6750
                </Text>
                <Text size='sm'>Hỗ trợ 24/7</Text>
              </Flex>
            </Flex>
          </Card>
        </GridCol>
      </Grid>
    )
  );
};

export default ServiceComponent;
