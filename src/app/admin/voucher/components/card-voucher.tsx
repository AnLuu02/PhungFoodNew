'use client';

import { Badge, Box, Button, Card, Highlight, Stack, Text } from '@mantine/core';
import { VoucherType } from '@prisma/client';
import { IconCopy, IconEdit, IconEye, IconTrash } from '@tabler/icons-react';
import { useState } from 'react';
import { confirmDelete } from '~/lib/ButtonHandler/ButtonDeleteConfirm';
import { formatDateViVN } from '~/lib/FuncHandler/Format';
import { NotifyError, NotifySuccess } from '~/lib/FuncHandler/toast';
import { getPromotionStatus, getStatusColor } from '~/lib/FuncHandler/vouchers-calculate';
import { api } from '~/trpc/react';

export default function CardVoucher({
  promotion,
  s,
  setSelectedPromotion
}: {
  promotion: any;
  s: string;
  setSelectedPromotion: any;
}) {
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const mutationDelete = api.Voucher.delete.useMutation();
  const mutationCreate = api.Voucher.create.useMutation({
    onSuccess: newPromotion => {
      if (newPromotion.code === 'OK') {
        NotifySuccess('Thao tác thành công!', 'Nhân bản thành công.');
        setLoading({ copy: false });
        utils.Voucher.invalidate();
      }
    },
    onError: e => {
      NotifyError(e.message);
    }
  });
  const mutationUpdate = api.Voucher.update.useMutation({
    onSuccess: newPromotion => {
      if (newPromotion.code === 'OK') {
        NotifySuccess('Thao tác thành công!', 'Cập nhật thành công.');
        setLoading({ copy: false });
        utils.Voucher.invalidate();
      }
    },
    onError: e => {
      NotifyError(e.message);
    }
  });
  const status = getPromotionStatus(promotion);
  const utils = api.useUtils();

  return (
    <>
      <Card withBorder radius={'md'} key={promotion.id} className='overflow-hidden bg-gray-100 dark:bg-dark-card'>
        <Stack>
          <Box>
            <Box className='flex items-start justify-between'>
              <Box className='flex-1'>
                <Highlight lineClamp={1} className='text-lg' fw={700} highlight={s}>
                  {promotion.name || 'Đang cập nhật'}
                </Highlight>
                <Highlight lineClamp={2} size='sm' highlight={s}>
                  {promotion.description}
                </Highlight>
              </Box>
              <Badge variant='light' radius={'md'} className={getStatusColor(status.name)}>
                {status.viName}
              </Badge>
            </Box>
          </Box>

          <Box className='flex items-center justify-between'>
            <Box className='flex items-center gap-2'>
              <Text fw={700}>Giảm: </Text>
              <Text size='sm'>
                {promotion.type === VoucherType.PERCENTAGE
                  ? `${promotion.discountValue}%`
                  : `$${promotion.discountValue}`}
              </Text>
            </Box>
            <code className='bg-muted rounded px-2 py-1 text-sm'>{promotion.code}</code>
          </Box>
          <Box className='grid grid-cols-2 gap-4 text-sm'>
            <Box>
              <Text size='sm'>Đã dùng</Text>
              <Text size='sm' fw={700}>
                {`${promotion.usedQuantity}/${promotion.quantity}`}
              </Text>
            </Box>
            <Box>
              <Text size='sm'>Có hiệu lực cho đến</Text>
              <Text size='sm' fw={700}>
                {formatDateViVN(promotion.endDate)}
              </Text>
            </Box>
          </Box>
          <Box className='flex gap-2'>
            <Button
              variant='outline'
              size='xs'
              loading={loading['toggle']}
              onClick={async () => {
                setLoading({ toggle: true });
                await mutationUpdate.mutateAsync({
                  where: {
                    id: promotion.id
                  },
                  data: {
                    isActive: !promotion.isActive
                  }
                });
              }}
              styles={{
                root: {
                  border: '1px solid '
                }
              }}
              classNames={{
                root: `flex-1 !rounded-md !border-gray-300 !font-bold text-black hover:bg-mainColor/10 hover:text-black data-[active=true]:!border-mainColor data-[active=true]:!bg-mainColor data-[active=true]:!text-white dark:!border-dark-dimmed dark:text-dark-text`
              }}
            >
              {promotion.isActive ? 'Tạm ẩn' : 'Hiển thị'}
            </Button>
            <Button
              variant='outline'
              size='xs'
              loading={loading['copy']}
              onClick={async () => {
                setLoading({ copy: true });
                await mutationCreate.mutateAsync({
                  ...promotion,
                  name: promotion.name + '-' + new Date().getTime(),
                  isActive: false,
                  id: ''
                });
              }}
              styles={{
                root: {
                  border: '1px solid '
                }
              }}
              classNames={{
                root: `!rounded-md !border-gray-300 !font-bold text-black hover:bg-mainColor/10 hover:text-black data-[active=true]:!border-mainColor data-[active=true]:!bg-mainColor data-[active=true]:!text-white dark:!border-dark-dimmed dark:text-dark-text`
              }}
            >
              <IconCopy className='h-4 w-4' />
            </Button>
            <Button
              variant='outline'
              size='xs'
              onClick={() => {
                setSelectedPromotion({ type: 'edit', data: promotion });
              }}
              styles={{
                root: {
                  border: '1px solid '
                }
              }}
              classNames={{
                root: `!rounded-md !border-gray-300 !font-bold text-black hover:bg-mainColor/10 hover:text-black data-[active=true]:!border-mainColor data-[active=true]:!bg-mainColor data-[active=true]:!text-white dark:!border-dark-dimmed dark:text-dark-text`
              }}
            >
              <IconEdit className='h-4 w-4' />
            </Button>
            <Button
              variant='outline'
              size='xs'
              onClick={() => {
                setSelectedPromotion({ type: 'view', data: promotion });
              }}
              styles={{
                root: {
                  border: '1px solid '
                }
              }}
              classNames={{
                root: `!rounded-md !border-gray-300 !font-bold text-black hover:bg-mainColor/10 hover:text-black data-[active=true]:!border-mainColor data-[active=true]:!bg-mainColor data-[active=true]:!text-white dark:!border-dark-dimmed dark:text-dark-text`
              }}
            >
              <IconEye className='h-4 w-4' />
            </Button>
            <Button
              variant='outline'
              size='xs'
              onClick={() => {
                confirmDelete({
                  id: { id: promotion?.id },
                  mutationDelete,
                  entityName: 'khuyến mãi',
                  callback: () => {
                    utils.Voucher.invalidate();
                  }
                });
              }}
              styles={{
                root: {
                  border: '1px solid '
                }
              }}
              classNames={{
                root: `!rounded-md !border-gray-300 !font-bold text-black hover:bg-mainColor/10 hover:text-black data-[active=true]:!border-mainColor data-[active=true]:!bg-mainColor data-[active=true]:!text-white dark:!border-dark-dimmed dark:text-dark-text`
              }}
            >
              <IconTrash className='h-4 w-4' />
            </Button>
          </Box>
        </Stack>
      </Card>
    </>
  );
}
