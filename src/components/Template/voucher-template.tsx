'use client';
import { Box, Button, Card, Checkbox, Divider, Flex, Group, Progress, Stack, Text, Tooltip } from '@mantine/core';
import clsx from 'clsx';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useState } from 'react';
import { useModal } from '~/contexts/ModalContext';
import { formatPriceLocaleVi } from '~/lib/func-handler/Format';
import { NotifyError, NotifySuccess, NotifyWarning } from '~/lib/func-handler/toast';
import { allowedVoucher, hoursRemainingVoucher } from '~/lib/func-handler/vouchers-calculate';
import { LocalVoucherType } from '~/lib/zod/EnumType';
import { api } from '~/trpc/react';
import DateVoucher from '../date-voucher';
type VoucherTemplateProps = {
  voucher: any;
  products?: any;
};
const VoucherTemplate = ({ voucher, products }: VoucherTemplateProps) => {
  const { openModal } = useModal();
  const [loading, setLoading] = useState(false);
  const { data: user } = useSession();
  const mutationRecivedVoucher = api.Voucher.update.useMutation();
  const isReceived = voucher?.voucherForUser?.length > 0;
  const utils = api.useUtils();

  const handleReceivedVoucher = async (id: string) => {
    setLoading(true);
    try {
      if (user?.user.id) {
        await mutationRecivedVoucher.mutateAsync(
          {
            where: {
              id: id
            },
            data: {
              voucherForUser: {
                create: {
                  quantityForUser: voucher.quantityForUser,
                  user: {
                    connect: {
                      id: user?.user.id
                    }
                  }
                }
              }
            }
          },
          {
            onSuccess: () => {
              utils.Voucher.invalidate();
              NotifySuccess('Thành công!', 'Nhận voucher thành công.');
            },
            onError: () => {
              NotifyError('Thất bại!', 'Không thể nhận voucher vào lúc này.');
            }
          }
        );
      } else {
        NotifyWarning('Chưa đăng nhập!', 'Đăng nhập để nhận voucher.');
      }
    } catch {
      setLoading(false);
      NotifyError('Đã xảy ra ngoại lệ. Hãy kiểm tra lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleUsedVoucher = (id: string) => {
    alert('Sử dụng thành công voucher ' + id);
  };

  return (
    <Card w={'98%'} p={0} shadow='xl' pos={'relative'} radius={'md'}>
      <Flex h={{ base: 'max-content', lg: 120 }}>
        <Flex
          w={{ base: 0, lg: 120 }}
          h='100%'
          direction={'column'}
          className='rounded-[10px]'
          align={'center'}
          justify='center'
          pos={'relative'}
        >
          <Image
            loading='lazy'
            height={120}
            width={120}
            style={{ objectFit: 'cover' }}
            src={
              voucher?.type === LocalVoucherType.PERCENTAGE
                ? '/images/png/voucher_bg_green.png'
                : '/images/png/voucher_bg_red.png'
            }
            alt=''
            className='hidden md:block'
          />
          <Flex direction='column' align='center' justify='center' pos={'absolute'} className='z-[10] hidden sm:flex'>
            <Text size='xs' className='text-center' c='#fff' fw={700}>
              {voucher?.code || 'Mama Voucher'}
            </Text>
          </Flex>
          {hoursRemainingVoucher(voucher.startDate, voucher?.endDate)?.type == 'active' ? (
            <Box
              className={clsx(
                `absolute right-[-6px] top-[6px] z-[1] hidden rounded-[2px] bg-[#EDA500] px-[4px] py-[2px] text-[9px] font-semibold text-white shadow-md md:block`
              )}
            >
              Dành cho bạn
            </Box>
          ) : hoursRemainingVoucher(voucher.startDate, voucher?.endDate)?.type == 'upcoming' ? (
            <Box
              className={clsx(
                `absolute right-[-6px] top-[6px] z-[1] hidden rounded-[2px] bg-[#00BB00] px-[4px] py-[2px] text-[9px] font-semibold text-white shadow-md md:block`
              )}
            >
              Sắp đến hạn sử dụng
            </Box>
          ) : (
            <Box
              className={clsx(
                `absolute right-[-6px] top-[6px] z-[1] hidden rounded-[2px] bg-red-500 px-[4px] py-[2px] text-[9px] font-semibold text-white shadow-md md:block`
              )}
            >
              Sắp hết hạn
            </Box>
          )}
        </Flex>
        <Flex p='xs' justify={'space-between'} align={'center'} h={'100%'} w={'100%'} flex={1} pos={'relative'}>
          <Divider orientation='vertical' h={'100%'} pos={'absolute'} right={40} top={0} variant='dashed' size={2} />
          <Flex h={'100%'} direction={'column'} flex={1} pr={30}>
            <Group>
              <Text size='sm' fw={500} lineClamp={1}>
                {voucher?.name}
              </Text>
              {products && products.length > 0 && !allowedVoucher(voucher?.minOrderPrice || 0, products) && (
                <Text size='xs' c='red' pos={'absolute'} bottom={2} right={10} className='z-50'>
                  Không đủ điều kiện
                </Text>
              )}
            </Group>
            <Tooltip
              label={` Đơn tối thiểu ${formatPriceLocaleVi(voucher?.minOrderPrice)}, giảm tối đa 
                                               ${formatPriceLocaleVi(voucher?.maxDiscount)}`}
            >
              <Text size='xs' c='dimmed' lineClamp={1}>
                Đơn tối thiểu {formatPriceLocaleVi(voucher?.minOrderPrice)}, giảm tối đa{' '}
                {formatPriceLocaleVi(voucher?.maxDiscount)}
              </Text>
            </Tooltip>
            <Stack gap={1} mt={8}>
              <Progress
                value={Math.floor((voucher?.usedQuantity / voucher?.quantity) * 100)}
                color='red'
                bg={'#DCDCDC'}
                radius='xs'
              />
              <Flex align={'center'} gap={4} justify={'end'}>
                <Text size='xs' c='dimmed' lineClamp={1}>
                  Còn lại:
                </Text>
                <Text size='xs' c='dimmed' lineClamp={1}>
                  {voucher.availableQuantity}/{voucher.quantity}
                </Text>
              </Flex>
            </Stack>

            <Flex align={'center'}>
              <DateVoucher item={voucher} />
              <Button
                variant='transparent'
                size='xs'
                pos={'relative'}
                className='z-[0] bg-white text-blue-500 dark:bg-dark-card'
                onClick={() => {
                  openModal('voucher', null, { voucher, products });
                }}
              >
                Điều kiện
              </Button>
            </Flex>
          </Flex>
          {!isReceived ? (
            <Button loading={loading} bg={'red'} size='xs' onClick={() => handleReceivedVoucher(voucher?.id)}>
              Nhận
            </Button>
          ) : products && products.length >= 0 ? (
            <Checkbox
              value={voucher?.id.toString()}
              disabled={products && products.length > 0 && !allowedVoucher(voucher?.minOrderPrice || 0, products)}
              id={`voucher-${voucher?.id.toString()}`}
            />
          ) : (
            <Button size='xs' onClick={() => handleUsedVoucher(voucher?.id)}>
              Sử dụng
            </Button>
          )}
        </Flex>
      </Flex>
      <Box className='absolute right-[-6px] top-[6px] z-[1] rounded-l-[10px] bg-red-500/30 px-[8px] py-[2px] text-[12px] font-semibold text-red-500'>
        x{' '}
        {voucher.voucherForUser?.length ? voucher.voucherForUser?.[0]?.quantityForUser : (voucher.quantityForUser ?? 0)}
      </Box>
    </Card>
  );
};
export default VoucherTemplate;
