'use client';

import { ActionIcon, Group, Modal, Paper, Title } from '@mantine/core';
import { IconEdit, IconEye, IconPlus, IconTrash } from '@tabler/icons-react';
import { useMemo, useState } from 'react';
import { confirmDelete } from '~/lib/button-handle/ButtonDeleteConfirm';
import { api } from '~/trpc/react';
import CreateInvoice from './form/CreateInvoice';
import UpdateInvoice from './form/UpdateInvoice';

import { Box, Card, Flex, Stack, Text } from '@mantine/core';
import Image from 'next/image';
import BButton from '~/components/Button/Button';
import { formatPriceLocaleVi } from '~/lib/func-handler/Format';
import { getImageProduct } from '~/lib/func-handler/getImageProduct';
import { LocalImageType } from '~/lib/zod/EnumType';

export function CreateInvoiceButton({ allData }: any) {
  const [opened, setOpened] = useState(false);
  const invoiceOrderIds = useMemo(() => {
    return allData.map((item: any) => item.orderId);
  }, [allData]);
  return (
    <>
      <BButton leftSection={<IconPlus size={16} />} onClick={() => setOpened(true)}>
        Tạo mới
      </BButton>
      <Modal
        opened={opened}
        closeOnClickOutside={false}
        size={'xl'}
        onClose={() => setOpened(false)}
        title={
          <Title order={2} className='font-quicksand'>
            Tạo hóa đơn
          </Title>
        }
      >
        <CreateInvoice invoiceOrderIds={invoiceOrderIds} setOpened={setOpened} />
      </Modal>
    </>
  );
}

export function UpdateInvoiceButton({ id }: { id: string }) {
  const [opened, setOpened] = useState(false);
  return (
    <>
      <ActionIcon variant='subtle' color='blue' onClick={() => setOpened(true)}>
        <IconEdit size={24} />
      </ActionIcon>
      <Modal
        size={'xl'}
        opened={opened}
        closeOnClickOutside={false}
        onClose={() => setOpened(false)}
        title={
          <Title order={2} className='font-quicksand'>
            Cập nhật hóa đơn
          </Title>
        }
      >
        <UpdateInvoice invoiceId={id.toString()} setOpened={setOpened} />
      </Modal>
    </>
  );
}

export function DeleteInvoiceButton({ id }: { id: string }) {
  const utils = api.useUtils();
  const mutationDelete = api.Invoice.delete.useMutation();
  return (
    <>
      <ActionIcon
        variant='subtle'
        color='red'
        onClick={() => {
          confirmDelete({
            id: { id },
            mutationDelete,
            entityName: 'nguyên liệu',
            callback: () => {
              utils.Invoice.invalidate();
            }
          });
        }}
      >
        <IconTrash size={24} />
      </ActionIcon>
    </>
  );
}
export function ViewInvoiceButton({ data }: { data: any }) {
  const [selectedInvoice, setSelectedInvoice] = useState(false);
  return (
    <>
      <ActionIcon variant='transparent' onClick={() => setSelectedInvoice(true)}>
        <IconEye size={24} />
      </ActionIcon>
      <Modal
        padding={'lg'}
        radius={'md'}
        size={'lg'}
        opened={selectedInvoice}
        onClose={() => setSelectedInvoice(false)}
        title={
          <Box>
            <Text fw={700} size='lg'>
              Chi tiết đơn hàng <b className='text-blue-500'>{data?.id}</b>
            </Text>
            <Text size='sm' c={'dimmed'}>
              Hoàn thành thông tin đơn hàng và các mặt hàng
            </Text>
          </Box>
        }
        classNames={{
          content: 'max-w-2xl'
        }}
      >
        {data && (
          <Box className='space-y-4'>
            <Box className='grid gap-4 md:grid-cols-2'>
              <Box>
                <Title order={4} className='mb-2 font-quicksand'>
                  Thông tin khách hàng
                </Title>
                <Box className='space-y-1 text-sm'>
                  <Text>
                    <strong>Tên:</strong> {data?.order?.user?.name || 'Đang cập nhật'}
                  </Text>
                  <Text>
                    <strong>Email:</strong> {data?.order?.user?.email || 'Đang cập nhật'}
                  </Text>
                  <Text>
                    <strong>Số điện thoại:</strong> {data?.order?.user?.phone || 'Đang cập nhật'}
                  </Text>
                  <Text>
                    <strong>Địa chỉ:</strong> {data?.order?.user?.address?.fullAddress || 'Chưa có địa chỉ'}
                  </Text>
                </Box>
              </Box>

              <Box>
                <Title order={4} className='mb-2 font-quicksand'>
                  Thông tin đơn hàng
                </Title>
                <Box className='space-y-1 text-sm'>
                  <Text>
                    <strong>Loại:</strong> Ăn uống
                  </Text>
                  <Text>
                    <strong>Trạng thái:</strong> {data?.order?.status || 'Đang cập nhật'}
                  </Text>
                  <Text>
                    <strong>Thanh toán:</strong> {data?.order?.payment?.name || 'Đang cập nhật'}
                  </Text>
                  <Text>
                    <strong>Đơn giá:</strong> {formatPriceLocaleVi(data?.order?.finalTotal) || 'Đang cập nhật'}
                  </Text>
                </Box>
              </Box>
            </Box>
            <Stack mt={'xl'}>
              <Title order={4} className='font-quicksand'>
                Danh sách mặt hàng
              </Title>
              {data?.order?.orderItems?.map((item: any) => (
                <Card radius={'md'} shadow='md' className='bg-gray-50 dark:bg-dark-card'>
                  <Flex align={'center'} justify={'space-between'}>
                    <Group>
                      <Image
                        src={getImageProduct(item?.product?.images, LocalImageType.THUMBNAIL) || ''}
                        width={60}
                        height={60}
                        style={{ objectFit: 'cover' }}
                        alt={item?.product?.name || ''}
                      />
                      <Box>
                        <Text fw={700}>{item?.product?.name || 'Đang cập nhật'}</Text>
                        <Text size='sm' c={'dimmed'}>
                          Số lượng: {item?.quantity || 0}
                        </Text>
                      </Box>
                    </Group>
                    <Text fw={700}>{formatPriceLocaleVi(item?.product?.price || 0)}</Text>
                  </Flex>
                </Card>
              ))}
            </Stack>
            <Stack mt={'xl'}>
              <Title order={4} className='font-quicksand'>
                Ghi chú
              </Title>
              <Paper p={'md'} className='bg-gray-100 dark:bg-dark-card'>
                <Text size='sm' c={'dimmed'}>
                  {data?.order?.note || 'Đang cập nhật'}
                </Text>
              </Paper>
            </Stack>
          </Box>
        )}
      </Modal>
    </>
  );
}
