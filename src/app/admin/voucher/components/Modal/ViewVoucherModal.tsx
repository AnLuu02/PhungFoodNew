'use client';

import { Badge, Box, Modal, Text } from '@mantine/core';
import { Dispatch, SetStateAction } from 'react';
import { formatDateViVN, formatPriceLocaleVi } from '~/lib/FuncHandler/Format';
import { getPromotionStatus } from '~/lib/FuncHandler/vouchers-calculate';
import { LocalVoucherType } from '~/lib/ZodSchema/enum';
import { VoucherFind } from '~/types/client-type-trpc';

export const ViewVoucherModal = ({
  selectedPromotion,
  setSelectedPromotion
}: {
  selectedPromotion: {
    type: 'edit' | 'view';
    data: NonNullable<VoucherFind>['vouchers'][0];
  } | null;
  setSelectedPromotion: Dispatch<
    SetStateAction<{
      type: 'edit' | 'view';
      data: NonNullable<VoucherFind>['vouchers'][0];
    } | null>
  >;
}) => {
  return (
    <Modal
      padding={'lg'}
      radius={'md'}
      opened={selectedPromotion !== null && selectedPromotion.type === 'view'}
      onClose={() => setSelectedPromotion(null)}
      title={
        <Box>
          <Text fw={700} size='lg'>
            {selectedPromotion?.data?.name}
          </Text>
          <Text size='sm' c={'dimmed'}>
            Chi tiết khuyến mãi và hiệu suất
          </Text>
        </Box>
      }
      classNames={{
        content: 'max-w-2xl'
      }}
    >
      {selectedPromotion && (
        <Box className='space-y-4'>
          <Box className='grid gap-4 md:grid-cols-2'>
            <Box>
              <Text className='mb-2' fw={700}>
                Thông tin cơ bản
              </Text>
              <Box className='space-y-1 text-sm'>
                <Text size='sm'>
                  <strong>Hình thức:</strong>{' '}
                  {selectedPromotion?.data.type === LocalVoucherType.FIXED ? 'Tiền mặt' : '% đơn hàng'}
                </Text>
                <Text size='sm'>
                  <strong>Giảm:</strong>{' '}
                  {selectedPromotion?.data?.type === 'PERCENTAGE'
                    ? `${selectedPromotion?.data?.discountValue}%`
                    : `$${selectedPromotion?.data?.discountValue}`}
                </Text>
                <Text size='sm'>
                  <strong>Mã:</strong> <code className='rounded bg-gray-100 px-1'>{selectedPromotion?.data?.code}</code>
                </Text>
                <Text size='sm'>
                  <strong>Trạng thái:</strong> {getPromotionStatus(selectedPromotion).viName}
                </Text>
              </Box>
            </Box>

            <Box>
              <Text fw={700} className='mb-2'>
                Hạn dùng
              </Text>
              <Box className='space-y-1 text-sm'>
                <Text size='sm'>
                  <strong>Đã dùng:</strong>{' '}
                  {`${selectedPromotion?.data?.usedQuantity}/${selectedPromotion?.data?.quantity}`}
                </Text>
                <Text size='sm'>
                  <strong>Ngày bắt đầu:</strong> {formatDateViVN(selectedPromotion?.data?.startDate)}
                </Text>
                <Text size='sm'>
                  <strong>Ngày kết thúc:</strong> {formatDateViVN(selectedPromotion?.data?.endDate)}
                </Text>
                {selectedPromotion?.data?.minOrderPrice && (
                  <Text size='sm'>
                    <strong>Đơn tối thiểu:</strong>{' '}
                    {formatPriceLocaleVi(+(selectedPromotion?.data?.minOrderPrice || 0))}
                  </Text>
                )}
              </Box>
            </Box>
          </Box>

          <Box>
            <Text fw={700}>Mô tả</Text>
            <Text size='sm' className='text-gray-600 dark:text-dark-text'>
              {selectedPromotion?.data?.description}
            </Text>
          </Box>

          <Box>
            <Text className='mb-2' fw={700}>
              Áp dụng cho
            </Text>
            <Box className='flex flex-wrap gap-1'>
              {selectedPromotion?.data?.applyAll && (
                <Badge
                  variant='outline'
                  className='text-xs'
                  styles={{
                    root: {
                      border: '1px solid '
                    }
                  }}
                  classNames={{
                    root: `!rounded-sm !border-gray-300 !font-bold text-black hover:bg-mainColor/10 hover:text-black data-[active=true]:!border-mainColor data-[active=true]:!bg-mainColor data-[active=true]:!text-white dark:!border-dark-dimmed dark:text-dark-text`
                  }}
                >
                  Tất cả khách hàng
                </Badge>
              )}
              {selectedPromotion?.data?.pointUser && selectedPromotion?.data?.pointUser > 0 && (
                <Badge
                  variant='outline'
                  className='text-xs'
                  styles={{
                    root: {
                      border: '1px solid '
                    }
                  }}
                  classNames={{
                    root: `!rounded-sm !border-gray-300 !font-bold text-black hover:bg-mainColor/10 hover:text-black data-[active=true]:!border-mainColor data-[active=true]:!bg-mainColor data-[active=true]:!text-white dark:!border-dark-dimmed dark:text-dark-text`
                  }}
                >
                  Khách hàng từ {selectedPromotion?.data?.pointUser}
                </Badge>
              )}
            </Box>
          </Box>
        </Box>
      )}
    </Modal>
  );
};
