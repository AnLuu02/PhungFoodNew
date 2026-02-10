'use client';

import { ActionIcon, Button, Group, Modal, Text, Title, Tooltip } from '@mantine/core';
import { IconCopy, IconEdit, IconPlus, IconPrinter, IconTrash } from '@tabler/icons-react';
import { useState } from 'react';
import BButton from '~/components/Button/Button';
import InvoiceToPrint from '~/components/InvoceToPrint';
import { confirmDelete } from '~/lib/ButtonHandler/ButtonDeleteConfirm';
import { handleConfirm } from '~/lib/ButtonHandler/ButtonHandleConfirm';
import { formatTransDate } from '~/lib/FuncHandler/Format';
import { regexCheckGuest } from '~/lib/FuncHandler/generateGuestCredentials';
import { NotifyError, NotifySuccess } from '~/lib/FuncHandler/toast';
import { LocalOrderStatus } from '~/lib/ZodSchema/enum';
import { api } from '~/trpc/react';
import { NotificationModal } from '../../settings/notification/components/modal/cretae_update_notification';
import CreateOrder from './form/CreateOrder';
import UpdateOrder from './form/UpdateOrder';

export function CreateOrderButton() {
  const [opened, setOpened] = useState(false);
  return (
    <>
      <BButton leftSection={<IconPlus size={16} />} onClick={() => setOpened(true)}>
        Tạo mới
      </BButton>
      <Modal
        closeOnClickOutside={false}
        size={'100%'}
        opened={opened}
        onClose={() => setOpened(false)}
        title={
          <Title order={2} className='font-quicksand'>
            Tạo hóa đơn
          </Title>
        }
      >
        <CreateOrder setOpened={setOpened} />
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
        <UpdateOrder orderId={id.toString()} setOpened={setOpened} />
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

export function CopyOrderButton({ data }: { data: any }) {
  const [loading, setLoading] = useState(false);
  const utils = api.useUtils();
  const mutationCreate = api.Order.create.useMutation({
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
              originalTotal: data?.originalTotal || 0,
              discountAmount: data?.discountAmount || 0,
              finalTotal: data?.finalTotal || 0,
              status: data?.status || LocalOrderStatus.UNPAID,
              userId: data?.userId || '',
              paymentId: data?.paymentId || '',
              transactionId: data?.transactionId || '',
              orderItems: data?.orderItems || [],
              delivery: {
                ...data?.delivery,
                id: undefined,
                orderId: undefined,
                address: {
                  ...data?.delivery.address,
                  id: undefined,
                  detail: data?.delivery.address?.detail || '',
                  provinceId: data?.delivery.address?.provinceId || '',
                  districtId: data?.delivery.address?.districtId || '',
                  wardId: data?.delivery.address?.wardId || '',
                  province: data?.delivery?.address?.province || '',
                  district: data?.delivery?.address?.district || '',
                  ward: data?.delivery?.address?.ward || '',
                  fullAddress: data?.delivery?.address?.fullAddress
                }
              } as any
            });
          }}
        >
          <IconCopy size={24} />
        </ActionIcon>
      </Tooltip>
    </>
  );
}

const statusOptions = Object.values(LocalOrderStatus).map(status => ({
  value: status,
  label: status
}));

export function SendMessageAllUserAdvanced() {
  const [opened, setOpened] = useState(false);

  return (
    <>
      <Tooltip label={<Text size='sm'>Gửi thông báo hàng loạt</Text>}>
        <BButton variant='outline' onClick={() => setOpened(true)}>
          Gửi thông báo hàng loạt
        </BButton>
      </Tooltip>

      <NotificationModal opened={opened} onClose={() => setOpened(false)} recipient='ALL' />
    </>
  );
}

const messageTemplates = [
  'Bạn còn món hàng chưa thanh toán!',
  'Đừng quên đặt món cho hôm nay nhé!',
  'Khuyến mãi hôm nay đã bắt đầu!',
  'Bạn đã tích lũy được điểm thưởng!',
  'Cảm ơn bạn đã sử dụng dịch vụ!'
];

export function SendMessageOrderButton({ user }: { user: any }) {
  const [opened, setOpened] = useState(false);
  return (
    <>
      <Tooltip label='Nhắc nhở thanh toán.'>
        <BButton variant='outline' onClick={() => setOpened(true)} disabled={regexCheckGuest.test(user?.email)}>
          Gửi thông báo
        </BButton>
      </Tooltip>

      <NotificationModal
        opened={opened}
        onClose={() => setOpened(false)}
        recipient='INDIVIDUAL'
        defaultValues={{
          recipients: [{ user: { id: user?.id, email: user?.email } } as any]
        }}
      />
    </>
  );
}

export function HandleStateOrderButton({ id, status, title }: { id: string; status: LocalOrderStatus; title: string }) {
  const utils = api.useUtils();
  const mutation = api.Order.update.useMutation({
    onError: e => {
      NotifyError(e.message);
    }
  });
  return (
    <>
      <Tooltip label={title || 'Giao hàng'}>
        <BButton
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
                  status: status || LocalOrderStatus.UNPAID
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
        </BButton>
      </Tooltip>
    </>
  );
}
