import {
  ActionIcon,
  Box,
  Button,
  Center,
  Checkbox,
  Divider,
  Group,
  Modal,
  ScrollArea,
  Stack,
  Text
} from '@mantine/core';
import { IconHelp } from '@tabler/icons-react';
import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { allowedVoucher } from '~/lib/FuncHandler/vouchers-calculate';
import { VoucherApplyStorage } from '~/shared/types/store.types';
import { useCartStore } from '~/stores/cart.store';
import { api } from '~/trpc/react';
import { ModalProps } from '~/types/modal';
import { useCartItems, useVoucherItems } from '../Hooks/use-cart';
import LoadingSpiner from '../Loading/LoadingSpiner';
import VoucherTemplate from '../Template/VoucherTemplate';

export default function ModalListVoucher({ opened, data, onClose }: ModalProps<{ userId: string }>) {
  const { userId } = data;
  const { data: fetchData, isLoading } = api.Voucher.getVoucherForUser.useQuery({
    userId
  });
  const { voucherValid, voucherIsRecived } = useMemo(() => {
    return (fetchData || []).reduce(
      (acc: { voucherValid: VoucherApplyStorage[]; voucherIsRecived: VoucherApplyStorage[] }, item) => {
        if (item.voucherForUser.some(vfu => vfu?.userId === userId)) {
          acc.voucherIsRecived.push(item);
        } else {
          acc.voucherValid.push(item);
        }
        return acc;
      },
      { voucherValid: [], voucherIsRecived: [] }
    );
  }, [JSON.stringify(fetchData)]);

  const cart = useCartItems();

  const appliedVouchers = useVoucherItems();
  const addVouchers = useCartStore(s => s.addVouchers);

  const { control, setValue } = useForm<{ voucherIds: string[] }>({
    defaultValues: {
      voucherIds: []
    }
  });

  useEffect(() => {
    const voucherIds: string[] = appliedVouchers.flatMap(item => (item.id ? [item.id] : []));
    setValue('voucherIds', voucherIds);
  }, [appliedVouchers]);

  return (
    <Modal
      opened={opened}
      onClose={() => {
        onClose?.();
      }}
      zIndex={200}
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
      {isLoading ? (
        <LoadingSpiner />
      ) : (
        <>
          <Center w={'100%'}>
            <Divider
              variant='dashed'
              size={'sm'}
              w={'100%'}
              classNames={{
                root: 'border-mainColor'
              }}
              labelPosition='center'
              label={
                <>
                  <Box ml={5} className='italic'>
                    Phụng Food Voucher
                  </Box>
                </>
              }
            />
          </Center>
          <ScrollArea.Autosize mah={430} w={'100%'} mb={10} scrollbarSize={5}>
            {fetchData && fetchData?.length > 0 ? (
              <Box px={'sm'}>
                <Controller
                  control={control}
                  name='voucherIds'
                  render={({ field }) => (
                    <Checkbox.Group
                      {...field}
                      onChange={value => {
                        field.onChange(value);
                        const selectedData = voucherIsRecived
                          .flatMap(voucher => {
                            if (value.includes(voucher?.id?.toString())) {
                              return [
                                {
                                  id: voucher.id,
                                  code: voucher.code,
                                  maxDiscount: voucher.maxDiscount,
                                  minOrderPrice: voucher.minOrderPrice,
                                  type: voucher.type,
                                  discountValue: voucher.discountValue
                                }
                              ];
                            }
                            return [];
                          })
                          .filter(Boolean);
                        addVouchers([...selectedData]);
                      }}
                    >
                      {voucherIsRecived?.length > 0 && (
                        <>
                          <Box>
                            <Text fw={500}>Kho voucher</Text>
                            <Text size='sm' c='dimmed'>
                              Có thể chọn 1 Voucher
                            </Text>
                          </Box>
                          <Stack mt={6} gap={'xs'}>
                            {voucherIsRecived?.map((item, index: number) => {
                              return (
                                <label
                                  key={index}
                                  htmlFor={`voucher-${item?.id.toString()}`}
                                  className={`relative w-full ${
                                    allowedVoucher(
                                      item?.minOrderPrice || 0,
                                      cart.map(p => ({ price: p?.product?.price, quantity: p?.quantity }))
                                    )
                                      ? 'cursor-pointer'
                                      : 'cursor-not-allowed'
                                  }`}
                                >
                                  <VoucherTemplate voucher={item} products={cart} />
                                </label>
                              );
                            })}
                          </Stack>
                        </>
                      )}
                    </Checkbox.Group>
                  )}
                />
                {voucherValid?.length > 0 && (
                  <>
                    <Center w={'100%'} mt={'lg'} mb={'sm'}>
                      <Divider
                        variant='dashed'
                        size={'sm'}
                        w={'100%'}
                        classNames={{
                          root: 'border-mainColor'
                        }}
                        labelPosition='center'
                        label={
                          <>
                            <Box ml={5} className='italic'>
                              Phụng Food Voucher
                            </Box>
                          </>
                        }
                      />
                    </Center>
                    <>
                      <Box>
                        <Text fw={500}>Dành cho bạn</Text>
                        <Text size='sm' c='dimmed'>
                          Có thể nhận Voucher
                        </Text>
                      </Box>
                      <Stack mb={10} mt={6} gap={'xs'}>
                        {voucherValid?.map((item, index: number) => {
                          return <VoucherTemplate voucher={item} products={cart} />;
                        })}
                      </Stack>
                    </>
                  </>
                )}
              </Box>
            ) : (
              <>
                <Text>Không có voucher khả dụng.</Text>
              </>
            )}
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
        </>
      )}
    </Modal>
  );
}
