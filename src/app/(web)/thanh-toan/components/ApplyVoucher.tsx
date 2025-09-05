import { Badge, Box, Button, Divider, Text, TextInput } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { IconGift, IconPlus, IconTag, IconX } from '@tabler/icons-react';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import ModalListVoucher from '~/components/Modals/ModalListVoucher';
import { formatPriceLocaleVi } from '~/lib/func-handler/Format';
import { NotifyError, NotifySuccess } from '~/lib/func-handler/toast';
import { allowedVoucher } from '~/lib/func-handler/vouchers-calculate';
import { LocalVoucherType } from '~/lib/zod/EnumType';
import { api } from '~/trpc/react';

const ApplyVoucher = ({ totalOrderPrice }: any) => {
  const [showVoucher, setShowVoucher] = useState(false);
  const [loading, setLoading] = useState(false);
  const [voucherData, setVoucherData] = useState<any[]>([]);
  const [voucherCode, setVoucherCode] = useState('');
  const { data: user } = useSession();
  const [cart] = useLocalStorage<any[]>({ key: 'cart', defaultValue: [] });
  const [appliedVouchers, setAppliedVouchers] = useLocalStorage<any[]>({
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
        const voucher = voucherData.find((item: any) => item.code?.toLowerCase() === voucherCode?.toLowerCase());
        if (!voucher || allowedVoucher(totalOrderPrice, cart)) {
          NotifyError('Voucher không hợp lệ. Hoặc không đủ điều kiện.', 'Vui lý nhập lại mã khuyên mãi.');
          return;
        }
        const isExist = appliedVouchers.find((item: any) => item.code?.toLowerCase() === voucher?.code?.toLowerCase());
        if (!isExist) {
          setAppliedVouchers(prev => {
            if (prev.some(item => item.code?.toLowerCase() === voucher?.code?.toLowerCase())) {
              return prev;
            }
            return [...prev, voucher];
          });
          NotifySuccess('Thành công!', 'Voucher đã được thêm vào.');
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
    NotifySuccess('Thành công!', 'Voucher đã được xóa.');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + '₫';
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
            variant='subtle'
            size='sm'
            c={'red'}
            className='h-auto p-1 text-xs'
            leftSection={<IconGift className='mr-1 h-3 w-3' />}
            onClick={async () => {
              if (user?.user.id) {
                setShowVoucher(true);
                setLoading(true);
                const data = await utils.Voucher.getVoucherForUser.fetch({
                  userId: user.user.id
                });
                setLoading(false);
                setVoucherData(data);
              } else {
                NotifyError('Cảnh báo!', 'Vui lớng đăng nhập để xem.');
              }
            }}
          >
            Chọn mã có sẵn
          </Button>
        </Box>

        {appliedVouchers.length > 0 && (
          <Box className='space-y-2'>
            {appliedVouchers.map(voucher => (
              <Box
                key={voucher.code}
                className='flex items-center justify-between rounded-md border border-green-200 bg-green-50 p-2'
              >
                <Box className='flex items-center gap-2'>
                  <Badge variant='secondary' className='bg-green-100 text-xs text-green-700'>
                    {voucher.code}
                  </Badge>
                  <span className='text-xs text-green-700'>
                    -
                    {voucher.type === LocalVoucherType.FIXED
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
              </Box>
            ))}
          </Box>
        )}

        <Box className='space-y-2'>
          <Box className='flex gap-2'>
            <TextInput
              placeholder='Nhập mã giảm giá'
              radius={'md'}
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
              className='border-gray-200 bg-transparent px-3'
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
        loading={loading}
        data={{ vouchers: voucherData, products: cart }}
        onClose={() => setShowVoucher(false)}
      />
      <Divider py={0} />
    </>
  );
};

export default ApplyVoucher;
