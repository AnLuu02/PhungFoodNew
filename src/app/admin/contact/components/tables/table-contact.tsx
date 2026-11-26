'use client';
import {
  ActionIcon,
  Badge,
  Box,
  Card,
  Flex,
  Group,
  Highlight,
  Paper,
  Select,
  SimpleGrid,
  Stack,
  Text,
  Title
} from '@mantine/core';
import { TypeContact } from '@prisma/client';
import { IconBrandAsana, IconHelpOctagon, IconMessageReply, IconPhysotherapist } from '@tabler/icons-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { CallPhoneButton, DeleteContactButton, SendMailButton } from '~/app/admin/contact/components/button';
import CustomPagination from '~/components/common/pagination';
import PageSizeSelector from '~/components/common/per-page';
import { SearchInput } from '~/components/search/search-input';
import { CardSkeleton } from '~/components/web/cards/card-skeleton';
import { formatDateViVN } from '~/lib/utils/format';
import { ContactTypeOptions } from '~/shared/constants/contact.constants';
import { FindContact } from '~/shared/types/trpc/contact.types';
import { api } from '~/trpc/react';

export default function TableContact() {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const router = useRouter();

  const s = searchParams.get('s') || '';
  const page = searchParams.get('page') || '1';
  const limit = searchParams.get('limit') ?? '5';

  const { data: dataClient, isLoading } = api.Contact.find.useQuery({ page: +page, limit: +limit, s });
  const { data: summary } = api.Contact.admin.getSummary.useQuery(undefined);

  const currentItems = dataClient?.contacts || [];
  const dataFilter = useMemo(() => {
    if (!summary) return [];

    const summaryMap = new Map(summary.byType.map(bt => [bt.type, bt]));

    return [
      {
        label: 'Hợp tác',
        value: summaryMap.get(TypeContact.COLLABORATION)?.count ?? 0,
        icon: IconBrandAsana,
        color: '#446DAE'
      },
      {
        label: 'Phản hổi',
        value: summaryMap.get(TypeContact.FEEDBACK)?.count ?? 0,
        icon: IconMessageReply,
        color: '#499764'
      },
      {
        label: 'Hỗ trợ',
        value: summaryMap.get(TypeContact.SUPPORT)?.count ?? 0,
        icon: IconHelpOctagon,
        color: '#C0A453'
      },
      {
        label: 'Khác',
        value: summaryMap.get(TypeContact.OTHER)?.count ?? 0,
        icon: IconPhysotherapist,
        color: '#CA041D'
      }
    ];
  }, [summary]);

  const utils = api.useUtils();
  useEffect(() => {
    if (dataClient?.pagination.hasNext) {
      void utils.Contact.find.prefetch({ page: +page + 1, limit: +limit, s });
    }
  }, [page]);

  return (
    <>
      <SimpleGrid cols={4}>
        {dataFilter?.map((item, index) => {
          const IconR = item.icon;
          return (
            <Card style={{ backgroundColor: item.color + 10 }} shadow='md' pos={'relative'} key={index} p={'md'}>
              <Flex align={'center'} gap={'md'}>
                <ActionIcon variant='light' size={'xl'} color={item.color}>
                  <IconR size={20} />
                </ActionIcon>
                <Box>
                  <Title order={6} className='font-quicksand'>
                    {item.label}
                  </Title>
                  <Title order={3} className='font-quicksand'>
                    {item.value}
                  </Title>
                </Box>
              </Flex>
            </Card>
          );
        })}
      </SimpleGrid>
      <Paper withBorder shadow='md' p={'md'}>
        <Group justify='space-between'>
          <SearchInput w={400} />
          <Group>
            <Select
              allowDeselect={false}
              value={searchParams.get('s') || 'all'}
              onChange={value => {
                if (value === 'all') params.delete('s');
                else {
                  params.set('s', value as string);
                  params.delete('page');
                }
                const url = `${location.pathname}?${params.toString()}`;
                router.push(url, { scroll: false });
              }}
              data={[{ value: 'all', label: 'Tất cả danh mục' }]}
              nothingFoundMessage='Không tìm thấy'
            />
          </Group>
        </Group>
      </Paper>
      <SimpleGrid cols={2} spacing='md'>
        {isLoading ? (
          [0, 0, 0, 0, 0, 0].map((_, index) => <CardSkeleton key={index} />)
        ) : currentItems.length > 0 ? (
          currentItems.map((row: FindContact['contacts'][number], index: number) => (
            <Paper
              key={index}
              withBorder
              radius='xl'
              p='md'
              pos={'relative'}
              className='bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:bg-dark-card'
            >
              <Stack gap={'md'} className='min-w-0 flex-1'>
                <Group justify='space-between' align='flex-start' wrap='wrap'>
                  <Stack gap={4}>
                    <Group gap={8}>
                      <Text size='xs' c='dimmed' fw={600}>
                        Người gửi:
                      </Text>
                      <Highlight size='sm' fw={700} highlight={s}>
                        {row.fullName}
                      </Highlight>
                    </Group>

                    <Group gap={8}>
                      <Text size='xs' c='dimmed' fw={600}>
                        Email:
                      </Text>
                      <Highlight size='xs' c='dimmed' highlight={s} fs={'italic'}>
                        {row.email}
                      </Highlight>
                    </Group>
                  </Stack>
                </Group>

                <Paper
                  withBorder
                  radius='md'
                  p='sm'
                  className='border-dashed border-gray-300 bg-gray-50 dark:border-dark-dimmed dark:bg-dark-card'
                >
                  <Stack gap={6}>
                    <Text size='xs' fw={700} c='dimmed'>
                      Nội dung liên hệ
                    </Text>

                    <Text size='sm' className='whitespace-pre-line break-words leading-relaxed'>
                      {row.message}
                    </Text>
                  </Stack>
                </Paper>

                <Group justify='space-between'>
                  <Group gap='lg' wrap='wrap'>
                    <Text size='xs' c='dimmed'>
                      SĐT: {row.phone}
                    </Text>

                    <Text size='xs' c='dimmed'>
                      Ngày gửi: {formatDateViVN(row.createdAt)}
                    </Text>
                  </Group>
                  <Group gap={6}>
                    <Badge variant='light' color={ContactTypeOptions[row.type]?.color}>
                      {ContactTypeOptions[row.type]?.viName}
                    </Badge>

                    <Badge bg={row.responded ? 'blue' : 'red'}>{row.responded ? 'Đã phản hồi' : 'Chờ'}</Badge>
                  </Group>
                </Group>
              </Stack>

              <Group gap='xs' wrap='nowrap' pos={'absolute'} top={10} right={16}>
                <SendMailButton userContactInfo={row} />
                <CallPhoneButton phone={row.phone || '0918064618'} />
                <DeleteContactButton id={row.id} />
              </Group>
            </Paper>
          ))
        ) : (
          <Paper withBorder radius='lg' p='xl' className='bg-gray-100 text-center dark:bg-dark-card'>
            <Text size='md' c='dimmed'>
              Không có bản ghi phù hợp.
            </Text>
          </Paper>
        )}
      </SimpleGrid>

      <Group justify='space-between' align='center' my={'md'}>
        <PageSizeSelector />
        <CustomPagination totalPages={dataClient?.pagination.totalPages || 1} />
      </Group>
    </>
  );
}
