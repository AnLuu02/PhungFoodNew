import { Badge, Box, Button, Divider, Paper, Text, TextInput } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { VoucherType } from '@prisma/client';
import { IconGift, IconPlus, IconTag, IconX } from '@tabler/icons-react';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { useCartItems } from '~/components/Hooks/use-cart';
import ModalListVoucher from '~/components/Modals/ModalListVoucher';
import { formatPriceLocaleVi } from '~/lib/FuncHandler/Format';
import { NotifyError, NotifySuccess } from '~/lib/FuncHandler/toast';
import { allowedVoucher } from '~/lib/FuncHandler/vouchers-calculate';
import { VoucherApplyStorage } from '~/shared/types/store.types';
import { api } from '~/trpc/react';

export const ApplyVoucher = ({ totalOrderPrice }: { totalOrderPrice: number }) => {
  const [showVoucher, setShowVoucher] = useState(false);
  const [loading, setLoading] = useState(false);
  const [voucherCode, setVoucherCode] = useState('');
  const { data: user } = useSession();
  const cart = useCartItems();
  const [appliedVouchers, setAppliedVouchers] = useLocalStorage<VoucherApplyStorage[]>({
    key: 'applied-vouchers',
    defaultValue: []
  });
  const utils = api.useUtils();

  const handleApplyVoucher = async () => {
    try {
      setLoading(true);
      const voucherData = await utils.Voucher.getVoucherForUser.fetch({
        userId: user?.user.id
      });
      if (voucherCode) {
        const voucher = voucherData.find(item => item.code?.toLowerCase() === voucherCode?.toLowerCase());
        if (
          !voucher ||
          allowedVoucher(
            totalOrderPrice,
            cart.map(c => ({ price: c.product.price ?? 0, quantity: c.quantity }))
          )
        ) {
          NotifyError('Voucher không hợp lệ. Hoặc không đủ điều kiện.', 'Vui lý nhập lại mã khuyên mãi.');
          return;
        }
        const isExist = appliedVouchers.find(item => item.code?.toLowerCase() === voucher?.code?.toLowerCase());
        if (!isExist) {
          setAppliedVouchers((prev: VoucherApplyStorage[]) => {
            if (prev.some(item => item.code?.toLowerCase() === voucher?.code?.toLowerCase())) {
              return prev;
            }
            return [...prev, voucher];
          });
          NotifySuccess('Thao tác thành công!', 'Voucher đã được thêm vào.');
          setVoucherCode('');
        } else {
          NotifyError('Thông báo!', 'Voucher này đã áp dụng rồi.');
        }
      }
    } catch {
      NotifyError('Đã xảy ra ngoại lệ. Hãy kiểm tra lại.');
    } finally {
      setLoading(false);
    }
  };
  const removeVoucher = (code: string) => {
    setAppliedVouchers(prev => prev.filter(item => item.code !== code));
    NotifySuccess('Thao tác thành công!', 'Voucher đã được xóa.');
  };

  return (
    <>
      <Divider />
      <Box className='space-y-3'>
        <Box className='flex items-center justify-between'>
          <Box className='flex items-center gap-2 text-sm font-medium'>
            <IconTag className='h-4 w-4' />
            <b>Mã giảm giá</b>
          </Box>

          <Button
            variant='transparent'
            size='sm'
            className='tex-red-500 h-auto p-1 text-xs hover:text-red-600'
            leftSection={<IconGift className='mr-1 h-3 w-3' />}
            onClick={async () => {
              setShowVoucher(true);
              // setLoading(true);
              // const data = await utils.Voucher.getVoucherForUser.fetch({
              //   userId: user?.user?.id
              // });
              // setLoading(false);
              // setVoucherData(data);
            }}
          >
            Chọn mã có sẵn
          </Button>
        </Box>

        {appliedVouchers.length > 0 && (
          <Box className='space-y-2'>
            {appliedVouchers.map(voucher => (
              <Paper
                m={0}
                key={voucher.code}
                className='flex items-center justify-between border border-green-200 bg-green-50 p-2'
              >
                <Box className='flex items-center gap-2'>
                  <Badge className='bg-green-100 text-xs text-green-700'>{voucher.code}</Badge>
                  <span className='text-xs text-green-700'>
                    -
                    {voucher.type === VoucherType.FIXED
                      ? formatPriceLocaleVi(voucher.maxDiscount)
                      : `${voucher.discountValue}%`}
                  </span>
                </Box>
                <Button
                  variant='subtle'
                  size='sm'
                  className='h-6 w-6 p-0 text-green-600 hover:bg-green-100 hover:text-green-700'
                  onClick={() => removeVoucher(voucher.code)}
                >
                  <IconX className='h-3 w-3' />
                </Button>
              </Paper>
            ))}
          </Box>
        )}

        <Box className='space-y-2'>
          <Box className='flex gap-2'>
            <TextInput
              placeholder='Nhập mã giảm giá'
              value={voucherCode}
              onChange={e => setVoucherCode(e.target.value)}
              className='flex-1 text-sm'
              onKeyDown={e => e.key === 'Enter' && handleApplyVoucher()}
            />
            <Button
              variant='outline'
              size='sm'
              onClick={() => handleApplyVoucher()}
              disabled={!voucherCode.trim()}
              className='border-[#E7EAED] bg-transparent px-3 dark:border-[#383838]'
              loading={loading}
            >
              <IconPlus className='h-4 w-4' />
            </Button>
          </Box>

          {appliedVouchers.length === 0 && (
            <Text size='xs' c={'dimmed'} className='py-2 text-center'>
              Nhập mã hoặc chọn từ danh sách có sẵn để được giảm giá
            </Text>
          )}
        </Box>
      </Box>
      <ModalListVoucher
        opened={showVoucher}
        onClose={() => setShowVoucher(false)}
        data={{ userId: user?.user?.id || '' }}
      />
      <Divider py={0} />
    </>
  );
};
