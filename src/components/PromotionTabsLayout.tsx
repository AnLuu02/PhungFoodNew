'use client';

import { Divider, Flex, Grid, GridCol, Group, Stack, Tabs, Text, ThemeIcon, Title } from '@mantine/core';
import { VoucherType } from '@prisma/client';
import { IconGift } from '@tabler/icons-react';
import { useSession } from 'next-auth/react';
import { useMemo, useState } from 'react';
import Empty from '~/components/Empty';
import VoucherTemplate from '~/components/Template/VoucherTemplate';
import { VoucherForUser } from '~/shared/type-trpc/voucher.type-trpc';
import { api } from '~/trpc/react';
import { CommonSkeleton } from './Loading/LoadingSkeleton';
import PaginationLocal from './PaginationLocal';

export function PromotionTabLayout() {
  const { data: session, status } = useSession();
  const userId = session?.user?.id;
  const { data, isLoading } = api.Voucher.getVoucherForUser.useQuery({
    userId: userId || ''
  });
  const vouchers = data || [];
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(4);
  const [activeTab, setActiveTab] = useState<string | null>('all');
  const filteredPromotions = useMemo(() => {
    if (activeTab === 'all') return vouchers;
    return vouchers.filter((promo: VoucherForUser[number]) => promo.type === activeTab);
  }, [activeTab, vouchers]);

  const totalPages = Math.ceil(filteredPromotions.length / perPage);
  const displayedPromotions = useMemo(
    () => filteredPromotions.slice((page - 1) * perPage, page * perPage),
    [filteredPromotions, page, perPage]
  );

  return (
    <>
      <Tabs
        variant='pills'
        value={activeTab}
        onChange={value => {
          setActiveTab(value as any);
          setPage(1);
        }}
        styles={{
          tab: {
            border: '1px solid ',
            marginRight: 6
          }
        }}
        classNames={{
          tab: `!border-[#e5e5e5] !font-bold hover:bg-mainColor/10 data-[active=true]:!border-mainColor data-[active=true]:!bg-mainColor data-[active=true]:!text-white dark:!border-dark-dimmed dark:text-dark-text`
        }}
      >
        <Flex
          gap={'md'}
          direction={{ base: 'column', md: 'row' }}
          justify={'space-between'}
          className='items-center sm:items-start md:items-center'
        >
          <Group align='center'>
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
                Có {filteredPromotions.length || 0} voucher
              </Text>
            </Stack>
          </Group>
          <Divider
            variant='dashed'
            className='sm:hidden'
            size={'sm'}
            w={'60%'}
            classNames={{
              root: 'border-mainColor'
            }}
            labelPosition='center'
            label={
              <>
                <Text c={'dimmed'} size='xs'>
                  vouchers
                </Text>
              </>
            }
          />
          <Tabs.List>
            <Group gap={0}>
              <Tabs.Tab size={'md'} fw={700} value='all'>
                Tất cả
              </Tabs.Tab>
              <Tabs.Tab size={'md'} fw={700} value={VoucherType.PERCENTAGE}>
                Phầm trăm
              </Tabs.Tab>
              <Tabs.Tab size={'md'} fw={700} value={VoucherType.FIXED}>
                Tiền mặt
              </Tabs.Tab>
            </Group>
          </Tabs.List>
        </Flex>

        <Divider
          variant='dashed'
          size={'sm'}
          my={'sm'}
          w={'100%'}
          classNames={{
            root: 'border-mainColor'
          }}
          labelPosition='center'
          label={
            <>
              <IconGift size={24} className='animate-wiggle italic' />
            </>
          }
        />
        <Tabs.Panel value={activeTab || 'all'}>
          {status == 'loading' || isLoading ? (
            <CommonSkeleton.InfoGrid />
          ) : displayedPromotions?.length > 0 ? (
            <Grid mt='md'>
              {displayedPromotions.map((promo: VoucherForUser[number]) => (
                <GridCol span={{ base: 12, sm: 6, md: 6, lg: 6 }} key={promo.id}>
                  <VoucherTemplate voucher={promo} products={[]} />
                </GridCol>
              ))}
            </Grid>
          ) : (
            <Empty
              title='Không có khuyến mãi nào'
              content='Vui lòng quay lại sau. Xin cảm ơn!'
              size='xs'
              hasButton={false}
            />
          )}
        </Tabs.Panel>
      </Tabs>
      <PaginationLocal
        page={page}
        perPage={perPage}
        totalPages={totalPages}
        dataSelectPerpage={[4, 8, 12, 16]}
        onChangePage={setPage}
        onSetPerpage={setPerPage}
      />
    </>
  );
}
