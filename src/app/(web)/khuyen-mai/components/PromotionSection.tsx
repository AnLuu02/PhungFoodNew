'use client';
import { Badge, Box, Card, Text, Title } from '@mantine/core';
import { IconReceiptDollarFilled } from '@tabler/icons-react';
import { useSession } from 'next-auth/react';
import { PromotionTabLayout } from '~/components/PromotionTabsLayout';
import { api } from '~/trpc/react';
export default function PromotionSection() {
  const { data: session } = useSession();
  const { data: voucherData } = api.Voucher.getVoucherForUser.useQuery({ userId: session?.user.id || '' });
  if (!voucherData || voucherData.length === 0) return null;
  return (
    <>
      <Box>
        <Box className='mb-12 text-center'>
          <Badge
            radius={'sm'}
            size='md'
            leftSection={<IconReceiptDollarFilled className='h-4 w-4' />}
            className='mb-4 bg-orange-50 text-xs text-orange-600'
          >
            Khuyến mãi hấp dẫn
          </Badge>
          <Title className='mb-4 text-balance font-quicksand text-3xl font-bold text-orange-600 sm:text-5xl'>
            Số lượng có hạn
          </Title>
          <Text c={'dimmed'} className='mx-auto max-w-2xl text-pretty text-lg'>
            Nhanh tay săn nhận ngay những voucher giảm giá sâu, ăn thả ga! Số lượng có hạn.
          </Text>
        </Box>

        <Card withBorder shadow='sm' padding='lg' radius='lg'>
          <PromotionTabLayout vouchers={voucherData} />
        </Card>
      </Box>
    </>
  );
}
