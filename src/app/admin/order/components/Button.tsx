'use client';

import { ActionIcon, Button, Group, Modal, Text, Title, Tooltip } from '@mantine/core';
import { OrderStatus } from '@prisma/client';
import { IconCopy, IconEdit, IconPlus, IconPrinter, IconTrash } from '@tabler/icons-react';
import { useState } from 'react';
import InvoiceToPrint from '~/components/InvoceToPrint';
import { confirmDelete } from '~/lib/ButtonHandler/ButtonDeleteConfirm';
import { handleConfirm } from '~/lib/ButtonHandler/ButtonHandleConfirm';
import { formatTransDate } from '~/lib/FuncHandler/Format';
import { regexCheckGuest } from '~/lib/FuncHandler/generateGuestCredentials';
import { NotifyError, NotifySuccess } from '~/lib/FuncHandler/toast';
import { api, RouterOutputs } from '~/trpc/react';
import { NotificationModal } from '../../settings/notification/components/modal/cretae_update_notification';
import OrderUpsert from './form/OrderUpsert';

export function CreateOrderButton() {
  const [opened, setOpened] = useState(false);
  return (
    <>
      <Button leftSection={<IconPlus size={16} />} onClick={() => setOpened(true)}>
        Tạo mới
      </Button>
      <Modal
        closeOnClickOutside={false}
        zIndex={150}
        size={'100%'}
        opened={opened}
        onClose={() => setOpened(false)}
        title={
          <Title order={2} className='font-quicksand'>
            Tạo hóa đơn
          </Title>
        }
      >
        <OrderUpsert setOpened={setOpened} />
      </Modal>
    </>
  );
}

export function SendOrderButton({ order }: any) {
  const [loading, setLoading] = useState(false);
  const sendTestEmail = async () => {
    setLoading(true);
    const transDate = formatTransDate(order.transDate ? order.transDate.toString() : '');
    const res = await fetch('/api/send-invoice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: order?.delivery?.email,
        subject: 'Hóa đơn mua hàng',
        data: order,
        orderTrackingUrl:
          `${process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_BASE_URL_DEPLOY}/vnpay-payment-result?orderId=${encodeURIComponent(order?.id?.trim())}` +
          `&transDate=${encodeURIComponent(transDate?.trim())}` +
          `&statusOrder=${encodeURIComponent(order?.status?.trim())}` +
          `&useLocal=1`
      })
    });

    const data = await res.json();
    if (data?.success) {
      NotifySuccess('Thao tác thành công!', 'Gửi hóa đơn thành công! ');
      setLoading(false);
    } else {
      NotifyError('Đã có lỗi không mong muốn!', data?.error);
      setLoading(false);
    }
  };
  return (
    <>
      <Button
        leftSection={<IconPrinter size={16} />}
        className={`!rounded-md !border-gray-300 !font-bold text-black duration-200 hover:bg-mainColor/10 hover:text-black/90 dark:!border-dark-dimmed dark:text-dark-text`}
        variant='subtle'
        loading={loading}
        onClick={() => {
          sendTestEmail();
        }}
      >
        Gửi hóa đơn
      </Button>
    </>
  );
}

export function UpdateOrderButton({ id }: { id: string }) {
  const [opened, setOpened] = useState(false);
  return (
    <>
      <Tooltip label='Cập nhật đơn hàng'>
        <ActionIcon variant='subtle' color='blue' onClick={() => setOpened(true)}>
          <IconEdit size={24} />
        </ActionIcon>
      </Tooltip>
      <Modal
        closeOnClickOutside={false}
        zIndex={150}
        size={'100%'}
        opened={opened}
        onClose={() => setOpened(false)}
        title={
          <Group gap={'xs'}>
            <Title order={2} className='font-quicksand'>
              Cập nhật đơn hàng
            </Title>

            <InvoiceToPrint id={id} />
          </Group>
        }
      >
        <OrderUpsert orderId={id.toString()} setOpened={setOpened} />
      </Modal>
    </>
  );
}

export function DeleteOrderButton({ id }: { id: string }) {
  const utils = api.useUtils();
  const mutationDelete = api.Order.delete.useMutation();

  return (
    <>
      <Tooltip label='Xóa hóa đơn'>
        <ActionIcon
          variant='subtle'
          color='red'
          onClick={() => {
            confirmDelete({
              id: { id },
              mutationDelete,
              entityName: 'đơn hàng',
              callback: () => {
                utils.Order.invalidate();
              }
            });
          }}
        >
          <IconTrash size={24} />
        </ActionIcon>
      </Tooltip>
    </>
  );
}

export function CopyOrderButton({ data }: { data: RouterOutputs['Order']['find']['orders'][number] }) {
  const [loading, setLoading] = useState(false);
  const utils = api.useUtils();
  const mutationCreate = api.Order.upsert.useMutation({
    onSuccess: () => {
      utils.Order.invalidate();
      setLoading(false);
      NotifySuccess('Copy hóa đơn thành công!');
    },
    onError: e => {
      setLoading(false);
      NotifyError(e.message);
    }
  });
  return (
    <>
      <Tooltip label='Nhân bản hóa đơn'>
        <ActionIcon
          variant='subtle'
          loading={loading}
          onClick={async () => {
            setLoading(true);
            await mutationCreate.mutateAsync({
              ...data,
              id: undefined,
              orderItems: data?.orderItems?.map(item => ({
                ...item,
                orderId: undefined
              }))
            } as any);
          }}
        >
          <IconCopy size={24} />
        </ActionIcon>
      </Tooltip>
    </>
  );
}

export function SendMessageAllUserAdvanced() {
  const [opened, setOpened] = useState(false);

  return (
    <>
      <Tooltip label={<Text size='sm'>Gửi thông báo hàng loạt</Text>}>
        <Button variant='outline' onClick={() => setOpened(true)}>
          Gửi thông báo hàng loạt
        </Button>
      </Tooltip>

      <NotificationModal opened={opened} onClose={() => setOpened(false)} recipient='all' />
    </>
  );
}

export function SendMessageOrderButton({ user }: { user: any }) {
  const [opened, setOpened] = useState(false);
  return (
    <>
      <Tooltip label='Nhắc nhở thanh toán.'>
        <Button variant='outline' onClick={() => setOpened(true)} disabled={regexCheckGuest.test(user?.email)}>
          Gửi thông báo
        </Button>
      </Tooltip>

      <NotificationModal
        opened={opened}
        onClose={() => setOpened(false)}
        recipient='individual'
        defaultValues={{
          recipients: [{ user: { id: user?.id, email: user?.email } } as any]
        }}
      />
    </>
  );
}

export function HandleStateOrderButton({ id, status, title }: { id: string; status: OrderStatus; title: string }) {
  const utils = api.useUtils();
  const mutation = api.Order.update.useMutation({
    onError: e => {
      NotifyError(e.message);
    }
  });
  return (
    <>
      <Tooltip label={title || 'Giao hàng'}>
        <Button
          variant='outline'
          onClick={() => {
            handleConfirm(
              id,
              mutation,
              {
                where: {
                  id: id
                },
                data: {
                  status: status || OrderStatus.UNPAID
                },
                orderId: id
              },
              title || 'Giao hàng',
              `Bạn chắc chắn muốn ${title || 'giao hàng'} đơn hàng này?`,
              () => {
                utils.Order.invalidate();
              }
            );
          }}
        >
          {title || 'Giao hàng'}
        </Button>
      </Tooltip>
    </>
  );
}
