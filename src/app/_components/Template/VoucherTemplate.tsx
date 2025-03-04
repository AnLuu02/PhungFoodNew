import { Box, Button, Card, Checkbox, Divider, Flex, Group, Image, Progress, Text } from '@mantine/core';
import { VoucherType } from '@prisma/client';
import clsx from 'clsx';
import { formatPriceLocaleVi } from '~/app/lib/utils/format/formatPrice';
import { allowedVoucher, hoursRemainingVoucher } from '~/app/lib/utils/func-handler/vouchers';
import DateVoucher from '../Modals/_components/DateVoucher';
const VoucherTemplate = ({ voucher, products, setOpenDetail }: any) => {
  return (
    <Card w={'98%'} p={0} shadow='md' pos={'relative'} radius={'sm'}>
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
            h={120}
            w={120}
            src={
              voucher?.type === VoucherType.PERCENTAGE
                ? '/images/png/voucher_bg_green.png'
                : '/images/png/voucher_bg_red.png'
            }
            alt=''
            className='hidden lg:block'
          />
          <Flex direction='column' align='center' justify='center' pos={'absolute'} className='z-[10] hidden md:flex'>
            <Text size='xs' className='text-center' c='#fff' fw={700}>
              MamaRestaurant Voucher
            </Text>
          </Flex>
          {hoursRemainingVoucher(voucher.startDate, voucher?.endDate)?.type == 'active' ? (
            <Box
              className={clsx(
                `absolute right-[-6px] top-[6px] z-[1] hidden rounded-[2px] bg-red-500 px-[4px] py-[2px] text-[9px] font-semibold text-white shadow-md lg:block`,
                `bg-[#EDA500]`
              )}
            >
              Dành cho bạn
            </Box>
          ) : hoursRemainingVoucher(voucher.startDate, voucher?.endDate)?.type == 'upcoming' ? (
            <Box
              className={clsx(
                `absolute right-[-6px] top-[6px] z-[1] hidden rounded-[2px] bg-red-500 px-[4px] py-[2px] text-[9px] font-semibold text-white shadow-md lg:block`,
                `bg-[#00BB00]`
              )}
            >
              Sắp đến hạn sử dụng
            </Box>
          ) : (
            <Box
              className={clsx(
                `absolute right-[-6px] top-[6px] z-[1] hidden rounded-[2px] bg-red-500 px-[4px] py-[2px] text-[9px] font-semibold text-white shadow-md lg:block`
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
              {!allowedVoucher(voucher?.minOrderPrice || 0, products) && (
                <Text size='xs' c='red' pos={'absolute'} bottom={2} right={10} className='z-50'>
                  Không đủ điều kiện
                </Text>
              )}
            </Group>
            <Text size='xs' c='dimmed' lineClamp={2}>
              Đơn tối thiểu {formatPriceLocaleVi(voucher?.minOrderPrice)}, giảm tối đa{' '}
              {formatPriceLocaleVi(voucher?.maxDiscount)}
            </Text>
            <Progress
              value={Math.floor((voucher?.quantity / 10) * 100)}
              color='red'
              bg={'#DCDCDC'}
              radius='xs'
              my={8}
            />

            <Flex align={'center'}>
              <DateVoucher item={voucher} />
              <Button
                variant='transparent'
                color='blue'
                size='xs'
                pos={'relative'}
                bg={'#fff'}
                className='z-[0]'
                onClick={() => {
                  setOpenDetail({ ...voucher });
                }}
              >
                Điều kiện
              </Button>
            </Flex>
          </Flex>
          <Checkbox
            value={voucher?.id.toString()}
            disabled={!allowedVoucher(voucher?.minOrderPrice || 0, products)}
            id={`voucher-${voucher?.id.toString()}`}
          />
        </Flex>
      </Flex>
      <Box className='absolute right-[-6px] top-[6px] z-[1] rounded-l-[10px] bg-red-500/30 px-[8px] py-[2px] text-[12px] font-semibold text-red-500'>
        x {voucher?.quantity}
      </Box>
    </Card>
  );
};
export default VoucherTemplate;
