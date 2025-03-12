import { Box, Button, Flex, Group, Image, Modal, Paper, Progress, ScrollArea, Text, Tooltip } from '@mantine/core';
import { VoucherType } from '@prisma/client';

import clsx from 'clsx';
import Link from 'next/link';
import { formatDate } from '~/app/lib/utils/format/formatDate';
import { formatPriceLocaleVi } from '~/app/lib/utils/format/formatPrice';
import { allowedVoucher, calculateMoney, hoursRemainingVoucher } from '~/app/lib/utils/func-handler/vouchers';

export default function ModalDetailVoucher({ opened, onClose, data, products }: any) {
  return (
    <Modal padding={0} opened={opened} onClose={onClose} withCloseButton={false} zIndex={99999} size={400}>
      <Box h={590} className='overflow-hidden'>
        <Box
          w={'100%'}
          h={100}
          pos={'absolute'}
          top={0}
          left={0}
          className='z-[-1] bg-gradient-to-bl from-[#ff7f50] to-[#ff6347]'
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
                  h={120}
                  w={120}
                  src={
                    data?.type === VoucherType.PERCENTAGE
                      ? '/images/png/voucher_bg_green.png'
                      : '/images/png/voucher_bg_red.png'
                  }
                  alt='aaaa'
                />
              </Box>
              <Flex direction='column' align='center' justify='center' pos={'absolute'} className='z-[10]'>
                <Text size='xs' className='text-center' c='#fff' fw={700}>
                  Mama Voucher
                </Text>
              </Flex>
              {hoursRemainingVoucher(data?.startDate, data?.endDate)?.type == 'active' ? (
                <Box
                  className={clsx(
                    `absolute right-[-6px] top-[6px] z-[1] rounded-[2px] bg-red-500 px-[4px] py-[2px] text-[9px] font-semibold text-white`,
                    `bg-[#EDA500]`
                  )}
                >
                  Dành cho bạn
                </Box>
              ) : hoursRemainingVoucher(data?.startDate, data?.endDate)?.type == 'upcoming' ? (
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
                  <Link href={`/san-pham/${data?.tag}`} className='no-underline'>
                    <Tooltip label={data?.name}>
                      <Text
                        lineClamp={1}
                        size='sm'
                        fw={700}
                        className='cursor-pointer text-center text-black hover:text-[#008b4b]'
                      >
                        {data?.name || 'Cá thu'}
                      </Text>
                    </Tooltip>
                  </Link>
                  {!allowedVoucher(data?.minOrderPrice || 0, products) && (
                    <Text size='xs' color='red' pos={'absolute'} bottom={2} right={10} className='z-50'>
                      Không đủ điều kiện
                    </Text>
                  )}
                </Group>
                <Text size='xs' c='dimmed' lineClamp={2}>
                  Đơn tối thiểu {formatPriceLocaleVi(data?.minOrderPrice)}, giảm tối đa{' '}
                  {formatPriceLocaleVi(data?.maxDiscount)}
                </Text>
                <Progress value={Math.floor((data?.quantity / 10) * 100)} radius='xs' mt={8} mb={8} styles={{}} />
                {hoursRemainingVoucher(data?.startDate, data?.endDate)?.type == 'active' ? (
                  <Text color='dimmed' size='xs' pr={4}>
                    {hoursRemainingVoucher(data?.startDate, data?.endDate)?.value}
                  </Text>
                ) : hoursRemainingVoucher(data?.startDate, data?.endDate)?.type == 'upcoming' ? (
                  <Text color='dimmed' size='xs' pr={4}>
                    {hoursRemainingVoucher(data?.startDate, data?.endDate)?.value}
                  </Text>
                ) : (
                  <Text color='dimmed' size='xs' pr={4}>
                    {hoursRemainingVoucher(data?.startDate, data?.endDate)?.value}
                  </Text>
                )}
              </Flex>
            </Flex>
          </Flex>

          {!allowedVoucher(data?.minOrderPrice || 0, products) && products?.length > 0 && (
            <Box className='w-full border-t border-gray-100 bg-gray-100 px-1 py-2'>
              <Text size='xs' c={'red'}>
                Đơn của bạn còn thiếu <b> {formatPriceLocaleVi(data?.minOrderPrice - calculateMoney(products))}đ</b> để
                sử dụng voucher.
              </Text>
            </Box>
          )}
          <Box className='absolute right-[-6px] top-[6px] z-[1] rounded-l-[10px] bg-red-500/30 px-[8px] py-[2px] text-[12px] font-semibold text-red-500'>
            x {data?.quantity}
          </Box>
        </Paper>

        <ScrollArea h={400} pb={30} mt={16} scrollbarSize={5}>
          <Box className='border-b border-white' px={'md'} pt={'xl'}>
            <Text className='mb-1 text-sm font-medium'>Hạn sử dụng mã</Text>
            <Text className='text-sm font-medium text-[rgb(186,180,180)]'>
              {`Từ ${formatDate(data?.startDate)} đến ${(data?.endDate, formatDate(data?.endDate))}`}
            </Text>
          </Box>

          {data?.description && (
            <Box className='border-b border-white' px={'md'} pt={'sm'}>
              <Text className='mb-1 text-sm font-medium'>Ưu đãi</Text>
              <Text className='text-sm font-medium text-[rgb(186,180,180)]'>{data?.description}</Text>
            </Box>
          )}

          <Box className='border-b border-white' px={'md'} pt={'sm'}>
            <Text className='mb-1 text-sm font-medium'>Áp dụng cho sản phẩm</Text>
            <Text className='text-sm font-medium text-[rgb(186,180,180)]'>
              Áp dụng cho toàn bộ sản phẩm với tổng đơn hàng tối thiểu là {formatPriceLocaleVi(data?.minOrderPrice)}
            </Text>
          </Box>

          <Box className='border-b border-white' px={'md'} pt={'sm'}>
            <Text className='mb-1 text-sm font-medium'>Thanh Toán</Text>
            <Text className='text-sm font-medium text-[rgb(186,180,180)]'>Tất cả các hình thức thanh toán</Text>
          </Box>

          <Box className='border-b border-white' px={'md'} pt={'sm'}>
            <Text className='mb-1 text-sm font-medium'>Xem chi tiết</Text>
            <Text className='text-sm font-medium text-[rgb(186,180,180)]'>
              Voucher giảm tối đa {formatPriceLocaleVi(data?.maxDiscount)} cho đơn hàng hợp lệ từ{' '}
              {formatPriceLocaleVi(data?.minOrderPrice)} áp dụng cho toàn bộ sản phẩm trong cửa hàng Phụng Food. HSD:{' '}
              {formatDate(data?.endDate)}. Số lượng có hạn chỉ còn {data?.quantity} cái.
            </Text>
          </Box>
        </ScrollArea>

        <Box className='fixed bottom-3 border-t border-white bg-white hover:opacity-75' w={'100%'} px={'md'}>
          <Button fullWidth color='orange' bg={'#ee4d2d'} onClick={onClose}>
            Đồng Ý
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
