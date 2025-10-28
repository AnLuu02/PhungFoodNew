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
  Table,
  Text,
  Title
} from '@mantine/core';
import { IconBrandAsana, IconHelpOctagon, IconMessageReply, IconPhysotherapist } from '@tabler/icons-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import PageSizeSelector from '~/components/Admin/Perpage';
import CustomPagination from '~/components/Pagination';
import { SearchInput } from '~/components/Search/SearchInput';
import { formatDateViVN } from '~/lib/FuncHandler/Format';
import { TypeContact } from '~/lib/ZodSchema/enum';
import { api } from '~/trpc/react';
import { CallPhoneButton, DeleteContactButton, SendMailButton } from '../Button';

export default function TableContact({ s, data, allData }: { s: string; data: any; allData: any }) {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const router = useRouter();
  const page = searchParams.get('page') || '1';
  const limit = searchParams.get('limit') || '5';
  const { data: dataClient } = api.Contact.find.useQuery({ skip: +page, take: +limit, s }, { initialData: data });

  const { data: allDataClient } = api.Contact.getAll.useQuery(undefined, { initialData: allData });
  const currentItems = dataClient?.contacts || [];
  const dataFilter = useMemo(() => {
    if (!allDataClient) return [];
    const summary = allDataClient.reduce(
      (acc: any, item: any) => {
        if (item.type === TypeContact.COLLABORATION) acc[TypeContact.COLLABORATION] += 1;
        else if (item.type === TypeContact.FEEDBACK) acc[TypeContact.FEEDBACK] += 1;
        else if (item.type === TypeContact.SUPPORT) acc[TypeContact.SUPPORT] += 1;
        else acc[TypeContact.OTHER] += 1;
        return acc;
      },
      { [TypeContact.COLLABORATION]: 0, [TypeContact.FEEDBACK]: 0, [TypeContact.OTHER]: 0, [TypeContact.SUPPORT]: 0 }
    );
    return [
      {
        label: 'Hợp tác',
        value: summary[TypeContact.COLLABORATION],
        icon: IconBrandAsana,
        color: '#446DAE'
      },
      {
        label: 'Phản hổi',
        value: summary[TypeContact.FEEDBACK],
        icon: IconMessageReply,
        color: '#499764'
      },
      {
        label: 'Hỗ trợ',
        value: summary[TypeContact.SUPPORT],
        icon: IconHelpOctagon,
        color: '#C0A453'
      },
      {
        label: 'Khác',
        value: summary[TypeContact.OTHER],
        icon: IconPhysotherapist,
        color: '#CA041D'
      }
    ];
  }, [allDataClient]);

  return (
    <>
      <SimpleGrid cols={4}>
        {dataFilter?.map((item, index) => {
          const IconR = item.icon;
          return (
            <Card
              style={{ backgroundColor: item.color + 10 }}
              shadow='md'
              radius={'lg'}
              pos={'relative'}
              key={index}
              p={'md'}
            >
              <Flex align={'center'} gap={'md'}>
                <ActionIcon variant='light' size={'xl'} radius={'md'} color={item.color}>
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
      <Paper radius={'lg'} withBorder shadow='md' p={'md'}>
        <Group justify='space-between'>
          <SearchInput width={400} />
          <Group>
            <Select
              allowDeselect={false}
              radius='md'
              value={searchParams.get('s') || 'all'}
              onChange={value => {
                if (value === 'all') params.delete('s');
                else {
                  params.set('s', value as string);
                  params.delete('page');
                }
                const url = `${location.pathname}?${params.toString()}`;
                router.push(url);
              }}
              data={[{ value: 'all', label: 'Tất cả danh mục' }]}
              nothingFoundMessage='Không tìm thấy'
            />
          </Group>
        </Group>
      </Paper>
      <Box className={`tableAdmin w-full overflow-x-auto`}>
        <Table striped highlightOnHover withTableBorder withColumnBorders>
          <Table.Thead className='rounded-lg text-sm uppercase leading-normal'>
            <Table.Tr>
              <Table.Th className='text-sm' style={{ minWidth: 100 }}>
                Khách hàng
              </Table.Th>
              <Table.Th className='text-sm' style={{ minWidth: 100 }}>
                Email
              </Table.Th>
              <Table.Th className='text-sm' style={{ minWidth: 100 }}>
                Số điện thoại
              </Table.Th>
              <Table.Th className='text-sm'>Nội dung</Table.Th>
              <Table.Th className='text-sm' style={{ minWidth: 100 }}>
                Ngày gửi
              </Table.Th>
              <Table.Th className='text-sm' style={{ minWidth: 100 }}>
                Trạng thái
              </Table.Th>
              <Table.Th className='text-sm' style={{ minWidth: 100 }}>
                Thao tác
              </Table.Th>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {currentItems.length > 0 ? (
              currentItems.map((row: any, index: number) => (
                <Table.Tr key={index}>
                  <Table.Td className='text-sm'>
                    <Highlight size='sm' highlight={s}>
                      {row.fullName}
                    </Highlight>
                  </Table.Td>
                  <Table.Td className='text-sm'>
                    <Highlight size='sm' highlight={s}>
                      {row.email}
                    </Highlight>
                  </Table.Td>
                  <Table.Td className='text-sm'>{row.phone}</Table.Td>
                  <Table.Td className='text-sm'>{row.message}</Table.Td>
                  <Table.Td className='text-sm'>{formatDateViVN(row.createdAt)}</Table.Td>
                  <Table.Td className='text-sm'>
                    <Badge bg={row.responded ? 'blue' : 'red'}>{row.responded ? 'Đã phản hồi' : 'Chờ'}</Badge>
                  </Table.Td>
                  <Table.Td className='text-sm'>
                    <Group className='text-center'>
                      <SendMailButton
                        userContactInfo={{
                          id: row.id,
                          name: row.fullName,
                          email: row.email,
                          message: row.message,
                          responded: row.responded
                        }}
                      />
                      <CallPhoneButton phone={row.phone} />
                      <DeleteContactButton id={row.id} />
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))
            ) : (
              <Table.Tr>
                <Table.Td colSpan={7} className='bg-gray-100 text-center dark:bg-dark-card'>
                  <Text size='md' c='dimmed'>
                    Không có bản ghi phù hợp.
                  </Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </Box>

      <Group justify='space-between' align='center' my={'md'}>
        <PageSizeSelector />
        <CustomPagination totalPages={data?.pagination.totalPages || 1} />
      </Group>
    </>
  );
}
