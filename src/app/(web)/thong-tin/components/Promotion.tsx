import { Box, Button, Card, Flex, Stack, Text, Title } from '@mantine/core';
import Link from 'next/link';
import { PromotionTabLayout } from '~/components/PromotionTabsLayout';

export function Promotions({ vouchers }: { vouchers: any }) {
  return (
    <Stack>
      <Flex className='sm:items-center' gap={'md'} justify={'space-between'} direction={{ base: 'column', sm: 'row' }}>
        <Box w={{ base: '100%', sm: '50%' }}>
          <Title order={2} className='font-quicksand'>
            Voucher của tôi
          </Title>
          <Text size='sm' c={'dimmed'}>
            Tất cả các voucher đã và đang khả dụng. Có thể sử dụng ngay.
          </Text>
        </Box>
        <Link href={'/thuc-don'}>
          <Button>Mua hàng ngay</Button>
        </Link>
      </Flex>
      <Card withBorder shadow='sm' padding='lg'>
        <PromotionTabLayout vouchers={vouchers} />
      </Card>
    </Stack>
  );
}
