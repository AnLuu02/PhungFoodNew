'use client';

import { ActionIcon, Box, Button, Card, Flex, Group, Highlight, Stack, Text } from '@mantine/core';
import { VoucherType } from '@prisma/client';
import { IconCopy, IconEdit, IconEye, IconTrash } from '@tabler/icons-react';
import { Dispatch, SetStateAction, useState } from 'react';
import { onHandleModalAction } from '~/lib/ButtonHandler/ButtonHandleAction';
import { formatDateViVN, formatPriceLocaleVi } from '~/lib/FuncHandler/Format';
import { NotifyError, NotifySuccess } from '~/lib/FuncHandler/toast';
import { getPromotionStatus, getStatusColor } from '~/lib/FuncHandler/vouchers-calculate';
import { FindVoucher } from '~/shared/type-trpc/voucher.type-trpc';
import { api } from '~/trpc/react';

export default function CardVoucher({
  promotion,
  s,
  setSelectedPromotion
}: {
  promotion: FindVoucher['vouchers'][number];
  s: string;
  setSelectedPromotion: Dispatch<
    SetStateAction<{
      type: 'edit' | 'view';
      data: FindVoucher['vouchers'][number];
    } | null>
  >;
}) {
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const mutationDelete = api.Voucher.delete.useMutation({
    onSuccess: () => {
      utils.Voucher.invalidate();
    }
  });
  const mutationCreate = api.Voucher.create.useMutation({
    onSuccess: () => {
      NotifySuccess('Thao tác thành công!', 'Nhân bản thành công.');
      setLoading({ copy: false });
      utils.Voucher.invalidate();
    },
    onError: e => {
      NotifyError(e.message);
    }
  });
  const mutationUpdate = api.Voucher.update.useMutation({
    onSuccess: () => {
      NotifySuccess('Thao tác thành công!', 'Cập nhật thành công.');
      setLoading({ copy: false });
      utils.Voucher.invalidate();
    },
    onError: e => {
      NotifyError(e.message);
    }
  });
  const status = getPromotionStatus(promotion?.startDate, promotion?.endDate, promotion?.isActive);
  const statusColor = getStatusColor(status.name);
  const promotionDescription =
    promotion.description?.trim() && promotion.description.trim().length > 24
      ? promotion.description
      : `Áp dụng voucher giảm ${
          promotion.type === VoucherType.PERCENTAGE
            ? `${promotion.discountValue}%`
            : `${formatPriceLocaleVi(promotion.discountValue)}`
        } cho đơn hàng trong thời gian khuyến mãi.`;
  const utils = api.useUtils();
  return (
    <>
      <Card
        withBorder
        key={promotion.id}
        p='md'
        className={`relative overflow-hidden border-dashed shadow-sm transition hover:scale-105 hover:shadow-md dark:border-dark-dimmed dark:bg-dark-card ${status.name === 'EXPIRED' ? 'opacity-80 grayscale-[0.15]' : ''} `}
      >
        {status.name !== 'ACTIVE' && (
          <>
            <Box className='pointer-events-none absolute inset-0 z-[2] flex items-center justify-center overflow-hidden'>
              <Text
                fw={900}
                className={`rotate-[-25deg] select-none whitespace-nowrap text-5xl tracking-[10px] ${statusColor.textBlur}`}
              >
                {status.viName}
              </Text>
            </Box>
            <Box
              className={`pointer-events-none absolute -left-10 top-0 z-[1] h-32 w-32 rounded-full ${statusColor.bgBlur} blur-3xl`}
            />
          </>
        )}
        <Stack gap='md'>
          <Box className='flex items-start justify-between gap-4'>
            <Box className='min-w-0 flex-1'>
              <Highlight lineClamp={1} className='text-base' fw={800} highlight={s}>
                {promotion.name || 'Đang cập nhật'}
              </Highlight>

              <Highlight lineClamp={3} size='sm' c='dimmed' mt={4} highlight={s} className='leading-relaxed'>
                {promotionDescription}
              </Highlight>
            </Box>

            <Flex
              direction={'column'}
              align={'center'}
              gap={4}
              justify={'center'}
              className='shrink-0 rounded-lg border border-dashed border-mainColor/50 px-3 py-2'
            >
              <Text size='xs' fw={700} c='dimmed'>
                GIẢM
              </Text>
              <Text fw={900} className='text-xl text-mainColor'>
                {promotion.type === VoucherType.PERCENTAGE
                  ? `${promotion.discountValue}%`
                  : `${formatPriceLocaleVi(promotion.discountValue)}`}
              </Text>
              <Box className='relative inline-flex items-center overflow-hidden rounded-xl border border-dashed border-mainColor/50 px-3 py-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.04)]'>
                <Highlight
                  highlight={s}
                  ff='monospace'
                  fw={900}
                  className='relative z-[2] text-sm tracking-[3px] text-mainColor'
                >
                  {promotion.code}
                </Highlight>
              </Box>
            </Flex>
          </Box>

          <Box className='grid grid-cols-2 gap-3 rounded-lg bg-gray-100 p-3 dark:bg-dark-background'>
            <Box>
              <Text size='xs' c='dimmed' fw={700}>
                Lượt sử dụng
              </Text>
              <Text size='sm' fw={800}>
                {`${promotion.usedQuantity}/${promotion.quantity}`}
              </Text>
            </Box>

            <Stack>
              <Box>
                <Text size='xs' c='dimmed' fw={700}>
                  Có hiệu lực từ
                </Text>
                <Text size='sm' fw={800}>
                  {formatDateViVN(promotion.startDate, { hour: true })}
                </Text>
              </Box>
              <Box>
                <Text size='xs' c='dimmed' fw={700}>
                  Đến
                </Text>
                <Text size='sm' fw={800}>
                  {formatDateViVN(promotion.endDate, { hour: true })}
                </Text>
              </Box>
            </Stack>
          </Box>

          <Group gap='xs' justify='space-between'>
            <Button
              variant={promotion.isActive ? 'danger' : 'filled'}
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
              className='flex-1 font-bold'
            >
              {promotion.isActive ? 'Tạm ẩn' : 'Hiển thị'}
            </Button>

            <ActionIcon
              variant='subtle'
              size='lg'
              radius='md'
              loading={loading['copy']}
              onClick={async () => {
                setLoading({ copy: true });
                await mutationCreate.mutateAsync({
                  ...promotion,
                  name: promotion.name + '-' + new Date().getTime(),
                  isActive: false,
                  id: ''
                } as any);
              }}
            >
              <IconCopy className='h-4 w-4' />
            </ActionIcon>

            <ActionIcon
              variant='subtle'
              size='lg'
              radius='md'
              color='blue'
              onClick={() => {
                setSelectedPromotion({ type: 'edit', data: promotion });
              }}
            >
              <IconEdit className='h-4 w-4' />
            </ActionIcon>

            <ActionIcon
              variant='subtle'
              size='lg'
              radius='md'
              color='gray'
              onClick={() => {
                setSelectedPromotion({ type: 'view', data: promotion });
              }}
            >
              <IconEye className='h-4 w-4' />
            </ActionIcon>

            <ActionIcon
              variant='subtle'
              size='lg'
              radius='md'
              color='red'
              onClick={() => {
                promotion?.id &&
                  onHandleModalAction({
                    type: 'delete',
                    customProps: {
                      onConfirm: async () => {
                        await mutationDelete.mutateAsync({ id: promotion.id });
                      }
                    }
                  });
              }}
            >
              <IconTrash className='h-4 w-4' />
            </ActionIcon>
          </Group>
        </Stack>
      </Card>
    </>
  );
}
