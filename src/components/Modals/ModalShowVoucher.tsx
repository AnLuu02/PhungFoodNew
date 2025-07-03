import { ActionIcon, Box, Button, Checkbox, Divider, Group, Modal, ScrollArea, Stack, Text } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { IconHelp } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { allowedVoucher } from '~/lib/func-handler/vouchers-calculate';
import VoucherTemplate from '../Template/VoucherTemplate';
import ModalDetailVoucher from './ModalDetailVoucher';
interface VoucherProps {
  opened: boolean;
  products?: any[];
  data: any;
  onClose: () => void;
}

export default function ModalShowVoucher({ opened, products, data, onClose }: VoucherProps) {
  const [openDetail, setOpenDetail] = useState(false);

  const [seletedVouchers, setSelectedVouchers] = useLocalStorage<any[]>({
    key: 'vouchers',
    defaultValue: []
  });

  const { control, setValue } = useForm<any>({
    defaultValues: {
      vouchers: []
    }
  });

  useEffect(() => {
    setValue('vouchers', seletedVouchers?.map((item: any) => item.id?.toString()) || []);
  }, [seletedVouchers]);

  return (
    <Modal
      opened={opened}
      onClose={() => {
        onClose?.();
      }}
      zIndex={9999}
      title={
        <Group w='100%'>
          <Text fw={600} size='lg'>
            Chọn PhungFood Voucher
          </Text>
          <ActionIcon variant='subtle'>
            <IconHelp size={18} />
          </ActionIcon>
        </Group>
      }
      size={500}
    >
      <Divider mb='sm' c={'dimmed'} w={'100%'} />
      <ScrollArea.Autosize mah={430} w={'100%'} mb={10} scrollbarSize={5}>
        <Controller
          control={control}
          name='vouchers'
          render={({ field }) => (
            <Checkbox.Group
              {...field}
              onChange={value => {
                field.onChange(value);
                setSelectedVouchers([...data.filter((item: any) => value.includes(item?.id?.toString()))]);
              }}
            >
              {data?.length > 0 ? (
                <>
                  <Box>
                    <Text fw={500}>Giảm giá tiền</Text>
                    <Text size='sm' c='dimmed'>
                      Có thể chọn 1 Voucher
                    </Text>
                  </Box>
                  <Stack mb={10} mt={6} gap={'xs'}>
                    {data?.map((item: any, index: number) => {
                      return (
                        <label
                          htmlFor={`voucher-${item?.id.toString()}`}
                          className={`relative w-full ${allowedVoucher(item?.minOrderPrice || 0, products) ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                        >
                          {
                            // <Card w={'98%'} p={0} shadow='md' pos={'relative'} radius={'sm'}>
                            //   <Flex h={120}>
                            //     <Flex
                            //       w={120}
                            //       h='100%'
                            //       direction={'column'}
                            //       className='rounded-[10px]'
                            //       align={'center'}
                            //       justify='center'
                            //       pos={'relative'}
                            //     >
                            //       <Image
                            //         loading='lazy'
                            //         height={120}
                            //         width={120}
                            //         src={
                            //           item?.type === LocalVoucherType.PERCENTAGE
                            //             ? '/images/png/voucher_bg_green.png'
                            //             : '/images/png/voucher_bg_red.png'
                            //         }
                            //         alt=''
                            //       />
                            //       <Flex
                            //         direction='column'
                            //         align='center'
                            //         justify='center'
                            //         pos={'absolute'}
                            //         className='z-[10]'
                            //       >
                            //         <Text size='xs' className='text-center' c='#fff' fw={700}>
                            //           Mama Voucher
                            //         </Text>
                            //       </Flex>
                            //       {hoursRemainingVoucher(item.startDate, item?.endDate)?.type == 'active' ? (
                            //         <Box
                            //           className={clsx(
                            //             `absolute right-[-6px] top-[6px] z-[1] rounded-[2px] bg-red-500 px-[4px] py-[2px] text-[9px] font-semibold text-white`,
                            //             `bg-[#EDA500]`
                            //           )}
                            //         >
                            //           Dành cho bạn
                            //         </Box>
                            //       ) : hoursRemainingVoucher(item.startDate, item?.endDate)?.type == 'upcoming' ? (
                            //         <Box
                            //           className={clsx(
                            //             `absolute right-[-6px] top-[6px] z-[1] rounded-[2px] bg-red-500 px-[4px] py-[2px] text-[9px] font-semibold text-white`,
                            //             `bg-[#00BB00]`
                            //           )}
                            //         >
                            //           Sắp đến hạn sử dụng
                            //         </Box>
                            //       ) : (
                            //         <Box
                            //           className={clsx(
                            //             `absolute right-[-6px] top-[6px] z-[1] rounded-[2px] bg-red-500 px-[4px] py-[2px] text-[9px] font-semibold text-white`
                            //           )}
                            //         >
                            //           Sắp hết hạn
                            //         </Box>
                            //       )}
                            //     </Flex>
                            //     <Flex p='xs' justify={'space-between'} align={'center'} h={'100%'} w={'100%'} flex={1}>
                            //       <Flex h={'100%'} direction={'column'} flex={1} pr={30}>
                            //         <Group>
                            //           <Text size='sm' fw={500} lineClamp={1}>
                            //             {item?.name}
                            //           </Text>
                            //           {!allowedVoucher(item?.minOrderPrice || 0, products) && (
                            //             <Text size='xs' c='red' pos={'absolute'} bottom={2} right={10} className='z-50'>
                            //               Không đủ điều kiện
                            //             </Text>
                            //           )}
                            //         </Group>
                            //         <Tooltip
                            //           label={` Đơn tối thiểu ${formatPriceLocaleVi(item?.minOrderPrice)}, giảm tối đa
                            //           ${formatPriceLocaleVi(item?.maxDiscount)}`}
                            //         >
                            //           <Text size='xs' c='dimmed' lineClamp={1}>
                            //             Đơn tối thiểu {formatPriceLocaleVi(item?.minOrderPrice)}, giảm tối đa{' '}
                            //             {formatPriceLocaleVi(item?.maxDiscount)}
                            //           </Text>
                            //         </Tooltip>
                            //         <Progress
                            //           value={Math.floor((item?.quantity / 10) * 100)}
                            //           color='red'
                            //           bg={'#DCDCDC'}
                            //           radius='xs'
                            //           my={8}
                            //         />

                            //         <Flex align={'center'}>
                            //           <DateVoucher item={item} />
                            //           <Button
                            //             variant='transparent'
                            //             color='blue'
                            //             size='xs'
                            //             pos={'relative'}
                            //             bg={'#fff'}
                            //             className='z-[49]'
                            //             onClick={() => {
                            //               setOpenDetail(true);
                            //             }}
                            //           >
                            //             Điều kiện
                            //           </Button>
                            //         </Flex>
                            //       </Flex>
                            //       <Checkbox
                            //         value={item?.id.toString()}
                            //         disabled={!allowedVoucher(item?.minOrderPrice || 0, products)}
                            //         id={`voucher-${item?.id.toString()}`}
                            //       />
                            //     </Flex>
                            //   </Flex>
                            //   <Box className='absolute right-[-6px] top-[6px] z-[1] rounded-l-[10px] bg-red-500/30 px-[8px] py-[2px] text-[12px] font-semibold text-red-500'>
                            //     x {item?.quantity}
                            //   </Box>
                            // </Card>

                            <VoucherTemplate voucher={item} products={products} setOpenDetail={setOpenDetail} />
                          }
                        </label>
                      );
                    })}
                  </Stack>
                </>
              ) : (
                <Text>Không có voucher khả dụng.</Text>
              )}
            </Checkbox.Group>
          )}
        />
      </ScrollArea.Autosize>

      <Divider my={'md'} />
      <Group gap='sm' justify='end'>
        <Button variant='default' onClick={onClose}>
          TRỞ LẠI
        </Button>
        <Button color='red' onClick={onClose}>
          OK
        </Button>
      </Group>
      <ModalDetailVoucher opened={openDetail} onClose={() => setOpenDetail(false)} data={data} products={products} />
    </Modal>
  );
}
