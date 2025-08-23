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
  const [openDetail, setOpenDetail] = useState<{ opened: boolean; voucherDetail: any }>({
    opened: false,
    voucherDetail: {}
  });

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
                            <VoucherTemplate voucher={item} products={products} setOpenDetail={setOpenDetail} />
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
        <ModalDetailVoucher
          openDetail={openDetail}
          onClose={() => setOpenDetail({ opened: false, voucherDetail: {} })}
          products={products}
        />
      </>
    </Modal>
  );
}
