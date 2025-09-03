'use client';

import { Box, Group, Highlight, Table, Text } from '@mantine/core';
import PageSizeSelector from '~/components/Admin/Perpage';
import CustomPagination from '~/components/Pagination';
import { formatDateViVN, formatPriceLocaleVi } from '~/lib/func-handler/Format';
import { LocalVoucherType } from '~/lib/zod/EnumType';
import { DeleteVoucherButton, UpdateVoucherButton } from '../Button';

export default function TableVoucher({ s, data, user }: { s: string; data: any; user?: any }) {
  const currentItems = data?.vouchers || [];

  return (
    <>
      <Box className={`tableAdmin w-full overflow-x-auto`}>
        <Table striped highlightOnHover withTableBorder withColumnBorders>
          <Table.Thead className='rounded-lg text-sm uppercase leading-normal'>
            <Table.Tr>
              <Table.Th className='text-sm'>Tên</Table.Th>
              <Table.Th className='text-sm'>Mô tả</Table.Th>
              <Table.Th className='text-sm'>Hình thức</Table.Th>
              <Table.Th className='text-sm'>Giá trị giảm</Table.Th>
              <Table.Th className='text-sm'>Giảm tối đa</Table.Th>
              <Table.Th className='text-sm'>Đơn tối thiểu</Table.Th>
              <Table.Th className='text-sm'>Số lượng</Table.Th>
              <Table.Th className='text-sm'>Đã dùng</Table.Th>
              <Table.Th className='text-sm'>Còn lại</Table.Th>
              <Table.Th className='text-sm'>VIP</Table.Th>
              <Table.Th className='text-sm'>Mã đơn</Table.Th>
              <Table.Th className='text-sm'>Bắt đầu</Table.Th>
              <Table.Th className='text-sm'>Kết thúc</Table.Th>
              <Table.Th className='text-sm'>Thao tác</Table.Th>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {currentItems.length > 0 ? (
              currentItems.map((item: any) => (
                <Table.Tr key={item.id}>
                  <Table.Td className='text-sm'>{item.name}</Table.Td>
                  <Table.Td className='text-sm'>
                    <Highlight size='sm' highlight={s}>
                      {item.description || 'Đang cập nhật.'}
                    </Highlight>
                  </Table.Td>
                  <Table.Td className='text-sm'>
                    {item.type === LocalVoucherType.FIXED ? 'Tiền mặt' : '% đơn hàng'}
                  </Table.Td>
                  <Table.Td className='text-sm'>
                    {item.type === LocalVoucherType.FIXED
                      ? formatPriceLocaleVi(String(item.discountValue))
                      : `${item.discountValue}%`}
                  </Table.Td>
                  <Table.Td className='text-sm'>{formatPriceLocaleVi(String(item.maxDiscount))}</Table.Td>
                  <Table.Td className='text-sm'>{formatPriceLocaleVi(String(item.minOrderPrice))}</Table.Td>
                  <Table.Td className='text-sm'>{item.quantity}</Table.Td>
                  <Table.Td className='text-sm'>{item.usedQuantity}</Table.Td>
                  <Table.Td className='text-sm'>{item.availableQuantity}</Table.Td>
                  <Table.Td className='text-sm'>{item.pointUser ?? 'Không yêu cầu'}</Table.Td>
                  <Table.Td className='text-sm'>{item.orderId ?? 'Không có'}</Table.Td>
                  <Table.Td className='text-sm'> {formatDateViVN(item.startDate)} </Table.Td>
                  <Table.Td className='text-sm'>{formatDateViVN(item.endDate)}</Table.Td>
                  <Table.Td className='text-sm'>
                    <Group>
                      <UpdateVoucherButton id={item.id} />
                      {(user?.user?.email === process.env.NEXT_PUBLIC_EMAIL_SUPER_ADMIN ||
                        user?.user?.role?.name === 'ADMIN') && <DeleteVoucherButton id={item.id} />}
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))
            ) : (
              <Table.Tr>
                <Table.Td colSpan={14} className='bg-gray-100 text-center'>
                  <Text size='md' c='dimmed'>
                    Không có bản ghi phù hợp.
                  </Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </Box>

      <Group justify='space-between' mt='md'>
        <PageSizeSelector />
        <CustomPagination totalPages={data?.pagination.totalPages || 1} />
      </Group>
    </>
  );
}
