import { ActionIcon, Box, Button, Checkbox, Divider, Group, Modal, ScrollArea, Stack, Text } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { IconHelp } from '@tabler/icons-react';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { allowedVoucher } from '~/lib/FuncHandler/vouchers-calculate';
import { VoucherApplyStorage } from '~/shared/types/store.types';
import { api } from '~/trpc/react';
import { ModalProps } from '~/types/modal';
import { useCartItems } from '../Hooks/use-cart';
import LoadingSpiner from '../Loading/LoadingSpiner';
import VoucherTemplate from '../Template/VoucherTemplate';

export default function ModalListVoucher({ opened, data, onClose }: ModalProps<{ userId: string }>) {
  const { userId } = data;
  const { data: fetchData, isLoading } = api.Voucher.getVoucherForUser.useQuery({
    userId
  });
  const cart = useCartItems();

  const vouchers = fetchData || [];
  const products = cart || [];
  const [appliedVouchers, setSelectedVouchers] = useLocalStorage<VoucherApplyStorage[]>({
    key: 'applied-vouchers',
    defaultValue: []
  });

  const { control, setValue } = useForm<{ vouchers: string[] }>({
    defaultValues: {
      vouchers: []
    }
  });

  useEffect(() => {
    const voucherIds: string[] = appliedVouchers.flatMap(item => (item.id ? [item.id] : []));
    setValue('vouchers', voucherIds);
  }, [appliedVouchers]);

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
      {isLoading ? (
        <LoadingSpiner />
      ) : (
        <>
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
                    const selectedData = vouchers
                      .flatMap(voucher => {
                        if (value.includes(voucher?.id?.toString())) {
                          return [
                            {
                              ...voucher
                            }
                          ];
                        }
                        return [];
                      })
                      .filter(Boolean);
                    setSelectedVouchers([...selectedData]);
                  }}
                >
                  {vouchers?.length > 0 ? (
                    <>
                      <Box>
                        <Text fw={500}>Giảm giá tiền</Text>
                        <Text size='sm' c='dimmed'>
                          Có thể chọn 1 Voucher
                        </Text>
                      </Box>
                      <Stack mb={10} mt={6} gap={'xs'}>
                        {vouchers?.map((item, index: number) => {
                          return (
                            <label
                              key={index}
                              htmlFor={`voucher-${item?.id.toString()}`}
                              className={`relative w-full ${
                                allowedVoucher(
                                  item?.minOrderPrice || 0,
                                  products.map(p => ({ price: p?.product?.price, quantity: p?.quantity }))
                                )
                                  ? 'cursor-pointer'
                                  : 'cursor-not-allowed'
                              }`}
                            >
                              <VoucherTemplate voucher={item} products={products} />
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
        </>
      )}
    </Modal>
  );
}
