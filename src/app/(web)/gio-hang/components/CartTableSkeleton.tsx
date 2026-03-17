import { Flex, Group, Paper, Skeleton, Stack, Table } from '@mantine/core';

export function CartTableSkeleton() {
  return (
    <Table className='mb-6'>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Thông tin</Table.Th>
          <Table.Th w={100} className='hidden lg:table-cell'>
            Đơn giá
          </Table.Th>
          <Table.Th w={100}>Số lượng</Table.Th>
          <Table.Th w={100}>Giảm giá</Table.Th>
          <Table.Th w={100}>Thành tiền</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {Array(5)
          .fill(0)
          .map((_, index) => (
            <Table.Tr key={index}>
              <Table.Td>
                <Group wrap='nowrap' align='center'>
                  <Paper
                    withBorder
                    w={80}
                    h={80}
                    className='hidden items-center justify-center overflow-hidden rounded-lg sm:flex'
                  >
                    <Skeleton height={60} width={60} radius='md' />
                  </Paper>

                  <Stack gap={6} align='start' flex={1}>
                    <Skeleton height={18} width='80%' radius='sm' />

                    <Group>
                      <Skeleton height={20} width={20} circle />
                      <Skeleton height={16} width={80} radius='sm' className='lg:hidden' />
                      <Skeleton height={16} width={50} radius='sm' />
                    </Group>

                    <Flex justify='space-between' w='100%' align='center'>
                      <Skeleton height={14} width={100} radius='xl' />
                      <Skeleton height={24} width={60} radius='sm' />
                    </Flex>
                  </Stack>
                </Group>
              </Table.Td>

              <Table.Td className='hidden lg:table-cell'>
                <Skeleton height={18} width={80} radius='sm' />
              </Table.Td>

              <Table.Td>
                <Skeleton height={36} width={80} radius='md' />
              </Table.Td>

              <Table.Td>
                <Skeleton height={18} width={80} radius='sm' />
              </Table.Td>

              <Table.Td>
                <Skeleton height={18} width={80} radius='sm' />
              </Table.Td>
            </Table.Tr>
          ))}
      </Table.Tbody>
    </Table>
  );
}
