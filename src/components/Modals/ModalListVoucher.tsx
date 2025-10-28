import { ActionIcon, Box, Button, Checkbox, Divider, Group, Modal, ScrollArea, Stack, Text } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { IconHelp } from '@tabler/icons-react';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { allowedVoucher } from '~/lib/FuncHandler/vouchers-calculate';
import { ModalProps } from '~/types/modal';
import LoadingSpiner from '../Loading/LoadingSpiner';
import VoucherTemplate from '../Template/VoucherTemplate';
type ModalListVoucherProps<T = any> = ModalProps<T> & {
  loading?: boolean;
};
export default function ModalListVoucher({ opened, data, loading, onClose }: ModalListVoucherProps<any>) {
  const vouchers = data.vouchers || [];
  const products = data.products || [];
  const [appliedVouchers, setSelectedVouchers] = useLocalStorage<any[]>({
    key: 'applied-vouchers',
    defaultValue: []
  });

  const { control, setValue } = useForm<any>({
    defaultValues: {
      vouchers: []
    }
  });

  useEffect(() => {
    setValue('vouchers', appliedVouchers?.map((item: any) => item.id?.toString()) || []);
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
      {loading ? (
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
                    setSelectedVouchers([...vouchers.filter((item: any) => value.includes(item?.id?.toString()))]);
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
                        {vouchers?.map((item: any, index: number) => {
                          return (
                            <label
                              key={index}
                              htmlFor={`voucher-${item?.id.toString()}`}
                              className={`relative w-full ${allowedVoucher(item?.minOrderPrice || 0, products) ? 'cursor-pointer' : 'cursor-not-allowed'}`}
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
