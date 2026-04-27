'use client';

import {
  ActionIcon,
  Badge,
  Button,
  Divider,
  Group,
  Modal,
  Paper,
  ScrollAreaAutosize,
  SimpleGrid,
  Title
} from '@mantine/core';
import {
  IconCalendar,
  IconCreditCard,
  IconEdit,
  IconEye,
  IconFileText,
  IconPlus,
  IconTrash,
  IconUser
} from '@tabler/icons-react';
import { useState } from 'react';
import { confirmDelete } from '~/lib/ButtonHandler/ButtonDeleteConfirm';
import { api } from '~/trpc/react';

import { Box, Card, Flex, Stack, Text } from '@mantine/core';
import Image from 'next/image';
import { formatDateViVN, formatPriceLocaleVi } from '~/lib/FuncHandler/Format';
import { getImageProduct } from '~/lib/FuncHandler/getImageProduct';
import InvoiceUpsert from './form/InvoiceUpsert';

export function CreateInvoiceButton({ allData }: any) {
  const [opened, setOpened] = useState(false);
  return (
    <>
      <Button leftSection={<IconPlus size={16} />} onClick={() => setOpened(true)}>
        Tạo mới
      </Button>
      <Modal
        opened={opened}
        closeOnClickOutside={false}
        zIndex={150}
        size={'xl'}
        onClose={() => setOpened(false)}
        title={
          <Title order={2} className='font-quicksand'>
            Tạo hóa đơn
          </Title>
        }
      >
        <InvoiceUpsert invoiceId={allData?.id} setOpened={setOpened} />
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
        zIndex={150}
        closeOnClickOutside={false}
        onClose={() => setOpened(false)}
        title={
          <Title order={2} className='font-quicksand'>
            Cập nhật hóa đơn
          </Title>
        }
      >
        <InvoiceUpsert invoiceId={id.toString()} setOpened={setOpened} />
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
  const [opened, setOpened] = useState(false);
  return (
    <>
      <ActionIcon variant='transparent' onClick={() => setOpened(true)}>
        <IconEye size={24} />
      </ActionIcon>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        size='xl'
        zIndex={150}
        radius='lg'
        padding={0}
        withCloseButton={false}
        transitionProps={{ transition: 'fade', duration: 200 }}
        classNames={{
          title: 'w-full'
        }}
        title={
          data ? (
            <Box className='rounded-t-lg bg-mainColor p-6 text-white' w={'100%'}>
              <Flex justify='space-between' align='center'>
                <Box>
                  <Group gap='xs'>
                    <IconFileText size={28} />
                    <Title order={3} className='font-quicksand uppercase'>
                      Hóa đơn điện tử
                    </Title>
                  </Group>
                  <Text size='sm' opacity={0.8} mt={4}>
                    Số: {data.invoiceNumber} | ID: {data.id}
                  </Text>
                </Box>
                <Badge size='xl' color='white' variant='white' className='font-bold text-blue-600'>
                  {data.paidAt ? 'ĐÃ THANH TOÁN' : 'CHỜ THANH TOÁN'}
                </Badge>
              </Flex>
            </Box>
          ) : (
            'Hóa đơn trống'
          )
        }
      >
        {data && (
          <ScrollAreaAutosize mah={500} scrollbarSize={5}>
            <Box p='xl' className='space-y-8'>
              <SimpleGrid cols={{ base: 1, md: 2 }} spacing='xl'>
                <Stack gap='xs'>
                  <Title
                    order={5}
                    className='flex items-center gap-2 font-quicksand uppercase tracking-wider text-gray-700'
                  >
                    <IconUser size={18} /> Bên mua hàng
                  </Title>
                  <Divider size='xs' color='blue.2' />
                  <Box className='space-y-1'>
                    <Text fw={700} size='lg'>
                      {data.buyerName}
                    </Text>
                    {data.buyerTaxCode && (
                      <Text size='sm'>
                        MST: <span className='font-mono'>{data.buyerTaxCode}</span>
                      </Text>
                    )}
                    <Text size='sm'>SĐT: {data.buyerPhone || 'N/A'}</Text>
                    <Text size='sm'>Email: {data.buyerEmail || 'N/A'}</Text>
                    <Text size='sm'>Địa chỉ: {data.buyerAddress || 'N/A'}</Text>
                  </Box>
                </Stack>

                <Stack gap='xs'>
                  <Title
                    order={5}
                    className='flex items-center gap-2 font-quicksand uppercase tracking-wider text-gray-700'
                  >
                    <IconCalendar size={18} /> Thời gian & Thanh toán
                  </Title>
                  <Divider size='xs' color='blue.2' />
                  <Box className='space-y-1'>
                    <Text size='sm'>
                      <b>Ngày lập:</b> {formatDateViVN(data.issuedAt)}
                    </Text>
                    <Text size='sm'>
                      <b>Ngày trả:</b> {data.paidAt ? formatDateViVN(data.paidAt) : '---'}
                    </Text>
                    <Text size='sm' className='flex items-center gap-1'>
                      <IconCreditCard size={16} />
                      <b>Phương thức:</b> {data.paymentMethod}
                    </Text>
                    <Text size='sm'>
                      <b>Mã đơn hàng:</b> #{data.orderId.slice(-8).toUpperCase()}
                    </Text>
                  </Box>
                </Stack>
              </SimpleGrid>

              <Box>
                <Title order={5} mb='sm' className='font-quicksand uppercase tracking-wider text-gray-700'>
                  Chi tiết hàng hóa
                </Title>
                <Stack gap='xs'>
                  {data.order?.orderItems?.map((item: any, idx: number) => (
                    <Card key={idx} withBorder p='sm' className='transition-colors hover:bg-gray-50'>
                      <Flex justify='space-between' align='center'>
                        <Group>
                          <Image
                            src={
                              getImageProduct(item?.product?.imageForEntities, 'THUMBNAIL') ||
                              '/images/png/empty_cart.png'
                            }
                            width={50}
                            alt='Anh mon an'
                            height={50}
                            className='rounded-md'
                          />
                          <Box>
                            <Text fw={600} size='sm'>
                              {item.product.name}
                            </Text>
                            <Text size='xs' c='dimmed'>
                              Số lượng: {item.quantity} x {formatPriceLocaleVi(item.originalPrice)}
                            </Text>
                          </Box>
                        </Group>
                        <Box className='text-right'>
                          {item.discountAmount > 0 && (
                            <Text size='xs' c='red' td='line-through'>
                              -{formatPriceLocaleVi(item.discountAmount * item.quantity)}
                            </Text>
                          )}
                          <Text fw={700}>{formatPriceLocaleVi(item.subTotal)}</Text>
                        </Box>
                      </Flex>
                    </Card>
                  ))}
                </Stack>
              </Box>

              <Paper withBorder p='md' bg='gray.0' className='ml-auto max-w-sm'>
                <Stack gap='sm'>
                  <Flex justify='space-between'>
                    <Text size='sm' c='dimmed'>
                      Tạm tính:
                    </Text>
                    <Text size='sm' fw={600}>
                      {formatPriceLocaleVi(data.subTotal)}
                    </Text>
                  </Flex>
                  <Flex justify='space-between'>
                    <Text size='sm' c='red'>
                      Giảm giá (Voucher):
                    </Text>
                    <Text size='sm' fw={600} c='red'>
                      -{formatPriceLocaleVi(data.discountAmount)}
                    </Text>
                  </Flex>
                  <Flex justify='space-between'>
                    <Text size='sm' c='dimmed'>
                      Thuế VAT (8%):
                    </Text>
                    <Text size='sm' fw={600}>
                      {formatPriceLocaleVi(data.taxAmount)}
                    </Text>
                  </Flex>
                  <Divider />
                  <Flex justify='space-between'>
                    <Text fw={800} size='lg'>
                      TỔNG CỘNG:
                    </Text>
                    <Text fw={800} size='lg' c='blue'>
                      {formatPriceLocaleVi(data.totalAmount)}
                    </Text>
                  </Flex>
                </Stack>
              </Paper>

              {data.note && (
                <Box>
                  <Text size='xs' fw={700} c='dimmed' className='mb-1 uppercase'>
                    Ghi chú hóa đơn
                  </Text>
                  <Paper p='sm' withBorder className='bg-yellow-50/50 italic text-gray-600'>
                    <Text size='sm'>"{data.note}"</Text>
                  </Paper>
                </Box>
              )}
            </Box>

            <Box p='md' className='flex justify-end gap-3 rounded-b-lg border-t bg-gray-50'>
              <Button variant='danger' onClick={() => setOpened(false)}>
                Đóng
              </Button>
              {data.pdfUrl && (
                <a
                  href={data.pdfUrl}
                  target='_blank'
                  className='flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm text-white shadow-sm hover:bg-blue-700'
                >
                  <IconEye size={16} /> Xem bản PDF
                </a>
              )}
            </Box>
          </ScrollAreaAutosize>
        )}
      </Modal>
    </>
  );
}
