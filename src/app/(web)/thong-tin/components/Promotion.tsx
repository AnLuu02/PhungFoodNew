import { Box, Card, Flex, Stack, Text, Title } from '@mantine/core';
import Link from 'next/link';
import BButton from '~/components/Button/Button';
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
          <BButton>Mua hàng ngay</BButton>
        </Link>
      </Flex>
      <Card withBorder shadow='sm' padding='lg' radius='md'>
        <PromotionTabLayout vouchers={vouchers} />
      </Card>
    </Stack>
  );
}
