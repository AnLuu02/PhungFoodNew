import { Box, Button, Center, Flex, Group, Modal, Paper, Progress, ScrollArea, Text, Tooltip } from '@mantine/core';

import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { formatDateViVN, formatPriceLocaleVi } from '~/lib/func-handler/Format';
import { allowedVoucher, calculateMoney, hoursRemainingVoucher } from '~/lib/func-handler/vouchers-calculate';
import { LocalVoucherType } from '~/lib/zod/EnumType';

export default function ModalDetailVoucher({ openDetail, onClose, products }: any) {
  const voucherDetail = openDetail.voucherDetail;
  return (
    <Modal padding={0} opened={openDetail.opened} onClose={onClose} withCloseButton={false} zIndex={99999} size={400}>
      <Box h={590} className='overflow-hidden'>
        <Box
          w={'100%'}
          h={100}
          pos={'absolute'}
          top={0}
          left={0}
          className={`z-[-1] ${voucherDetail?.type === LocalVoucherType.FIXED ? 'bg-gradient-to-bl from-[#ff7f50] to-[#ff6347]' : 'bg-[#26ab99]/80'} `}
        ></Box>
        <Paper ml={12} mr={12} shadow='md' className='translate-y-[20px]' p={0} pos={'relative'}>
          <Flex h={120} pos={'relative'} p={0}>
            <Flex
              w={120}
              h='100%'
              pos={'relative'}
              direction={'column'}
              align={'center'}
              justify={'center'}
              className='rounded-l-[8px]'
            >
              <Box h={120} w={120} pos={'absolute'} left={'-3px'}>
                <Image
                  loading='lazy'
                  style={{ objectFit: 'cover' }}
                  height={120}
                  width={120}
                  src={
                    voucherDetail?.type === LocalVoucherType.PERCENTAGE
                      ? '/images/png/voucher_bg_green.png'
                      : '/images/png/voucher_bg_red.png'
                  }
                  alt='aaaa'
                />
              </Box>
              <Flex direction='column' align='center' justify='center' pos={'absolute'} className='z-[10]'>
                <Text size='xs' className='text-center' c='#fff' fw={700}>
                  {voucherDetail?.code || 'Mama Voucher'}
                </Text>
              </Flex>
              {hoursRemainingVoucher(voucherDetail?.startDate, voucherDetail?.endDate)?.type == 'active' ? (
                <Box
                  className={clsx(
                    `absolute right-[-6px] top-[6px] z-[1] rounded-[2px] bg-red-500 px-[4px] py-[2px] text-[9px] font-semibold text-white`,
                    `bg-[#EDA500]`
                  )}
                >
                  Dành cho bạn
                </Box>
              ) : hoursRemainingVoucher(voucherDetail?.startDate, voucherDetail?.endDate)?.type == 'upcoming' ? (
                <Box
                  className={clsx(
                    `absolute right-[-6px] top-[6px] z-[1] rounded-[2px] bg-red-500 px-[4px] py-[2px] text-[9px] font-semibold text-white`,
                    `bg-[#00BB00]`
                  )}
                >
                  Sắp đến hạn sử dụng
                </Box>
              ) : (
                <Box
                  className={clsx(
                    `absolute right-[-6px] top-[6px] z-[1] rounded-[2px] bg-red-500 px-[4px] py-[2px] text-[9px] font-semibold text-white`
                  )}
                >
                  Sắp hết hạn
                </Box>
              )}
            </Flex>
            <Flex p='xs' justify={'space-between'} align={'center'} h={'100%'} flex={1}>
              <Flex h={'100%'} direction={'column'} flex={1} pr={30}>
                <Group>
                  <Link href={`/san-pham/${voucherDetail?.tag}`}>
                    <Tooltip label={voucherDetail?.name}>
                      <Text
                        lineClamp={1}
                        size='sm'
                        fw={700}
                        className='cursor-pointer text-center text-black hover:text-mainColor dark:text-dark-text'
                      >
                        {voucherDetail?.name || 'Cá thu'}
                      </Text>
                    </Tooltip>
                  </Link>
                  {!allowedVoucher(voucherDetail?.minOrderPrice || 0, products) && (
                    <Text size='xs' c='red' pos={'absolute'} bottom={2} right={10} className='z-50'>
                      Không đủ điều kiện
                    </Text>
                  )}
                </Group>
                <Text size='xs' c='dimmed' lineClamp={2}>
                  Đơn tối thiểu {formatPriceLocaleVi(voucherDetail?.minOrderPrice)}, giảm tối đa{' '}
                  {formatPriceLocaleVi(voucherDetail?.maxDiscount)}
                </Text>
                <Progress
                  value={Math.floor((voucherDetail?.usedQuantity / voucherDetail?.quantity) * 100)}
                  radius='xs'
                  mt={8}
                  mb={8}
                  styles={{}}
                />
                {hoursRemainingVoucher(voucherDetail?.startDate, voucherDetail?.endDate)?.type == 'active' ? (
                  <Text c='dimmed' size='xs' pr={4}>
                    {hoursRemainingVoucher(voucherDetail?.startDate, voucherDetail?.endDate)?.value}
                  </Text>
                ) : hoursRemainingVoucher(voucherDetail?.startDate, voucherDetail?.endDate)?.type == 'upcoming' ? (
                  <Text c='dimmed' size='xs' pr={4}>
                    {hoursRemainingVoucher(voucherDetail?.startDate, voucherDetail?.endDate)?.value}
                  </Text>
                ) : (
                  <Text c='dimmed' size='xs' pr={4}>
                    {hoursRemainingVoucher(voucherDetail?.startDate, voucherDetail?.endDate)?.value}
                  </Text>
                )}
              </Flex>
            </Flex>
          </Flex>

          {!allowedVoucher(voucherDetail?.minOrderPrice || 0, products) && products?.length > 0 && (
            <Box className='w-full border-t border-gray-100 bg-gray-100 px-1 py-2'>
              <Text size='xs' className='text-red-500'>
                Đơn của bạn còn thiếu{' '}
                <b> {formatPriceLocaleVi(voucherDetail?.minOrderPrice - calculateMoney(products))}đ</b> để sử dụng
                voucher.
              </Text>
            </Box>
          )}
          <Box className='absolute right-[-6px] top-[6px] z-[1] rounded-l-[10px] bg-red-500/30 px-[8px] py-[2px] text-[12px] font-semibold text-red-500'>
            x{' '}
            {voucherDetail.voucherForUser?.length
              ? voucherDetail.voucherForUser?.[0]?.quantityForUser
              : (voucherDetail.quantityForUser ?? 0)}
          </Box>
        </Paper>

        <ScrollArea h={390} mt={16} scrollbarSize={5}>
          <Box className='border-b border-white' px={'md'} pt={'xl'}>
            <Text className='mb-1 text-sm' size='sm' fw={700}>
              Hạn sử dụng mã
            </Text>
            <Text fw={500} size='sm' c={'dimmed'}>
              {`Từ ${formatDateViVN(voucherDetail?.startDate)} đến ${(voucherDetail?.endDate, formatDateViVN(voucherDetail?.endDate))}`}
            </Text>
          </Box>

          {voucherDetail?.description && (
            <Box className='border-b border-white' px={'md'} pt={'sm'}>
              <Text className='mb-1 text-sm' size='sm' fw={700}>
                Ưu đãi
              </Text>
              <Text fw={500} size='sm' c={'dimmed'}>
                {voucherDetail?.description}
              </Text>
            </Box>
          )}

          <Box className='border-b border-white' px={'md'} pt={'sm'}>
            <Text className='mb-1 text-sm' size='sm' fw={700}>
              Áp dụng cho sản phẩm
            </Text>
            <Text fw={500} size='sm' c={'dimmed'}>
              Áp dụng cho toàn bộ sản phẩm với tổng đơn hàng tối thiểu là{' '}
              {formatPriceLocaleVi(voucherDetail?.minOrderPrice)}
            </Text>
          </Box>

          <Box className='border-b border-white' px={'md'} pt={'sm'}>
            <Text className='mb-1 text-sm' size='sm' fw={700}>
              Thanh Toán
            </Text>
            <Text fw={500} size='sm' c={'dimmed'}>
              Tất cả các hình thức thanh toán
            </Text>
          </Box>

          <Box className='border-b border-white' px={'md'} pt={'sm'}>
            <Text className='mb-1 text-sm' size='sm' fw={700}>
              Xem chi tiết
            </Text>
            <Text fw={500} size='sm' c={'dimmed'}>
              Voucher giảm tối đa {formatPriceLocaleVi(voucherDetail?.maxDiscount)} cho đơn hàng hợp lệ từ{' '}
              {formatPriceLocaleVi(voucherDetail?.minOrderPrice)} áp dụng cho toàn bộ sản phẩm trong cửa hàng Phụng
              Food. HSD: {formatDateViVN(voucherDetail?.endDate)}. Số lượng có hạn chỉ còn{' '}
              {voucherDetail?.quantity - voucherDetail?.usedQuantity} cái.
            </Text>
          </Box>
        </ScrollArea>

        <Center className='fixed bottom-3 border-t hover:opacity-75' w={'100%'}>
          <Button
            fullWidth
            className={`text-orange ${voucherDetail?.type === LocalVoucherType.FIXED ? 'bg-[#ee4d2d] hover:bg-[#f7431f]' : 'bg-[#26ab99] hover:bg-[#26ab99]/80'} `}
            onClick={onClose}
            w={'90%'}
          >
            Đồng Ý
          </Button>
        </Center>
      </Box>
    </Modal>
  );
}
