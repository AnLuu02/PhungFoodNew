'use client';

import { Grid, GridCol, Group, Paper, Spoiler, Stack, Text, ThemeIcon, Title } from '@mantine/core';
import { IconGift } from '@tabler/icons-react';
import VoucherTemplate from '~/components/Template/VoucherTemplate';

export default function DiscountCodes({ data }: { data: any }) {
  // const { data: session } = useSession();
  // const { data: vouchers = [] } = api.Voucher.getVoucherForUser.useQuery(
  //   { userId: session?.user?.id || '' },
  //   {
  //     enabled: !!session?.user?.id
  //   }
  // );

  // const voucherFinal = useMemo(() => {
  //   return [...data, ...vouchers];
  // }, [vouchers, data]);
  return (
    <Paper p='md' radius='md' className='bg-green-50 dark:bg-dark-background'>
      <Group align='center' mb={'xs'}>
        <ThemeIcon
          size='xl'
          classNames={{
            root: 'bg-subColor text-white'
          }}
        >
          <IconGift />
        </ThemeIcon>
        <Stack gap={1}>
          <Title order={3} className='font-quicksand'>
            Danh sách voucher
          </Title>
          <Text size='xs' c={'dimmed'}>
            Có {data.length || 0} voucher
          </Text>
        </Stack>
      </Group>
      <Spoiler
        maxHeight={150}
        showLabel={'Xem tất cả'}
        hideLabel={'Thu gọn'}
        classNames={{
          control: 'text-sm font-bold text-mainColor'
        }}
      >
        <Grid mt='md'>
          {data?.length > 0 &&
            data.map((promo: any) => (
              <GridCol span={{ base: 12, sm: 6, md: 6 }} key={promo.id}>
                <VoucherTemplate voucher={promo} />
              </GridCol>
            ))}
        </Grid>
      </Spoiler>
    </Paper>
  );
}
