'use client';

import {
  ActionIcon,
  Button,
  Drawer,
  Group,
  Modal,
  MultiSelect,
  Select,
  Text,
  TextInput,
  Title,
  Tooltip
} from '@mantine/core';
import { IconCopy, IconEdit, IconPlus, IconPrinter, IconTrash, IconXboxX } from '@tabler/icons-react';
import { useState } from 'react';
import BButton from '~/components/Button/Button';
import InvoiceToPrint from '~/components/InvoceToPrint';
import LoadingSpiner from '~/components/Loading/LoadingSpiner';
import { UserRole } from '~/constants';
import { confirmDelete } from '~/lib/button-handle/ButtonDeleteConfirm';
import { handleConfirm } from '~/lib/button-handle/ButtonHandleConfirm';
import { formatTransDate } from '~/lib/func-handler/Format';
import { NotifyError, NotifySuccess } from '~/lib/func-handler/toast';
import { LocalOrderStatus } from '~/lib/zod/EnumType';
import { api } from '~/trpc/react';
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
              note: data?.note || '',
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
  const [mode, setMode] = useState<'ALL' | 'SELECTED' | 'BY_STATUS' | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<LocalOrderStatus[]>([]);

  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [customMessage, setCustomMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const message = selectedTemplate || customMessage;

  const createNotifyMutation = api.Notification.create.useMutation();

  const { data: allUsers = [], isLoading: loadingUsers } = api.User.getFilter.useQuery(
    { s: UserRole.CUSTOMER },
    {
      enabled: mode === 'ALL' || mode === 'SELECTED'
    }
  );

  const { data: filteredOrders = [] } = api.Order.getFilter.useQuery(
    { s: selectedStatuses.join(',') },
    {
      enabled: mode === 'BY_STATUS' && selectedStatuses.length > 0
    }
  );

  const getTargetUsers = (): { id: string; email: string }[] => {
    if (mode === 'ALL') return allUsers;

    if (mode === 'SELECTED') {
      return allUsers.filter(u => selectedUsers.includes(u.id));
    }

    if (mode === 'BY_STATUS') {
      const map = new Map<string, { id: string; email: string }>();
      filteredOrders.forEach((o: any) => {
        if (o.userId && o.email) {
          map.set(o.userId, { id: o.userId, email: o.email });
        }
      });
      return Array.from(map.values());
    }

    return [];
  };

  const handleSendNotification = async () => {
    const targetUsers = getTargetUsers();
    if (!message || targetUsers.length === 0) return;

    setLoading(true);
    const userIds = targetUsers.map(u => u.id);
    const emails = targetUsers.map(u => u.email);

    const data = await createNotifyMutation.mutateAsync({
      userId: userIds,
      title: 'Thông báo nhắc nhở',
      message,
      isRead: false,
      isSendToAll: mode === 'ALL'
    });

    await fetch('/api/notify', {
      method: 'POST',
      body: JSON.stringify({ email: emails, data: data?.data || [] }),
      headers: { 'Content-Type': 'application/json' }
    });

    setLoading(false);
    NotifySuccess(`Đã gửi thông báo cho ${targetUsers.length} người dùng`);
    setOpened(false);
    setSelectedUsers([]);
    setSelectedStatuses([]);
    setCustomMessage('');
    setSelectedTemplate(null);
    setMode(null);
  };
  return (
    <>
      <Tooltip label={<Text size='sm'>Gửi thông báo hàng loạt</Text>}>
        <BButton variant='outline' onClick={() => setOpened(true)}>
          Gửi thông báo hàng loạt
        </BButton>
      </Tooltip>

      <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        title={
          <Title order={3} className='font-quicksand'>
            Gửi thông báo hàng loạt
          </Title>
        }
        position='right'
        size='lg'
      >
        <Select
          label='Chọn chế độ gửi'
          radius='md'
          placeholder='Chọn cách gửi'
          data={[
            { value: 'ALL', label: 'Gửi tất cả người dùng' },
            { value: 'SELECTED', label: 'Gửi người dùng được chọn' },
            { value: 'BY_STATUS', label: 'Gửi theo trạng thái đơn hàng' }
          ]}
          value={mode}
          onChange={value => {
            setMode(value as any);
            setSelectedUsers([]);
            setSelectedStatuses([]);
          }}
          mt='sm'
        />

        {mode === 'SELECTED' && (
          <MultiSelect
            label='Chọn người dùng'
            disabled={allUsers.length === 0}
            data={allUsers.map(u => ({
              value: u.id,
              label: u.name ? `${u.name} (${u.email})` : u.email
            }))}
            value={selectedUsers}
            onChange={setSelectedUsers}
            searchable
            mt='md'
            rightSection={loadingUsers ? <LoadingSpiner /> : undefined}
            error={
              (selectedUsers.length === 0 && 'Chưa chọn người dùng') ||
              (allUsers.length === 0 && 'Hiện không có khách hàng.')
            }
          />
        )}

        {mode === 'BY_STATUS' && (
          <MultiSelect
            label='Chọn trạng thái đơn hàng'
            data={statusOptions}
            value={selectedStatuses}
            onChange={value => setSelectedStatuses(value as LocalOrderStatus[])}
            mt='md'
          />
        )}

        <Select
          label='Chọn mẫu thông báo (tùy chọn)'
          placeholder='Chọn mẫu hoặc để trống để nhập tay'
          data={messageTemplates}
          radius='md'
          value={selectedTemplate}
          onChange={value => {
            setSelectedTemplate(value);
            setCustomMessage('');
          }}
          clearable
          mt='lg'
        />

        {!selectedTemplate && (
          <TextInput
            label='Tự nhập nội dung thông báo'
            placeholder='Nhập nội dung...'
            value={customMessage}
            onChange={e => setCustomMessage(e.currentTarget.value)}
            mt='md'
          />
        )}

        <Group justify='flex-end' mt='xl'>
          <Button
            variant='outline'
            onClick={handleSendNotification}
            loading={loading}
            disabled={!message || !mode || getTargetUsers().length === 0}
          >
            Gửi ({getTargetUsers().length} người)
          </Button>
        </Group>
      </Drawer>
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

export function SendMessageOrderButton({ userId, email }: any) {
  const [opened, setOpened] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [customMessage, setCustomMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const message = selectedTemplate || customMessage;

  const createNotifyMutation = api.Notification.create.useMutation();

  const handleSendNotification = async () => {
    if (!message) return;

    setLoading(true);
    const data = await createNotifyMutation.mutateAsync({
      userId: [userId],
      title: 'Thông báo nhắc nhở',
      message,
      isRead: false,
      isSendToAll: false
    });

    await fetch('/api/notify', {
      method: 'POST',
      body: JSON.stringify({ email, data: data?.data || [] }),
      headers: { 'Content-Type': 'application/json' }
    });

    setLoading(false);
    NotifySuccess('Thông báo đã được gửi!');
    setCustomMessage('');
    setSelectedTemplate(null);
    setOpened(false);
  };

  return (
    <>
      <Tooltip label='Nhắc nhở thanh toán.'>
        <Button onClick={() => setOpened(true)}>Gửi thông báo</Button>
      </Tooltip>

      <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        title={
          <Title order={3} className='font-quicksand'>
            Gửi thông báo cho khách hàng
          </Title>
        }
        position='right'
        size='md'
      >
        <TextInput label='Email' value={email} disabled />

        <Select
          label='Chọn mẫu thông báo (tùy chọn)'
          placeholder='Chọn mẫu hoặc để trống để nhập tay'
          data={messageTemplates}
          value={selectedTemplate}
          radius='md'
          onChange={value => {
            setSelectedTemplate(value);
            setCustomMessage('');
          }}
          clearable
          mt='md'
        />

        {!selectedTemplate && (
          <TextInput
            label='Tự nhập thông báo'
            placeholder='Nhập nội dung...'
            value={customMessage}
            onChange={e => setCustomMessage(e.currentTarget.value)}
            mt='md'
          />
        )}

        <Group justify='flex-end' mt='lg'>
          <Button variant='outline' onClick={handleSendNotification} loading={loading} disabled={!message}>
            Gửi
          </Button>
        </Group>
      </Drawer>
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
        </Button>
      </Tooltip>
    </>
  );
}

export function CancleOrderButton({ id }: { id: string }) {
  const utils = api.useUtils();
  const mutation = api.Order.update.useMutation({
    onError: e => {
      NotifyError(e.message);
    }
  });

  return (
    <>
      <Tooltip label='Hủy đơn hàng'>
        <ActionIcon
          variant='subtle'
          color='red'
          onClick={() => {
            handleConfirm(
              id,
              mutation,
              {
                where: {
                  id: id
                },
                data: {
                  status: LocalOrderStatus.CANCELLED
                },
                orderId: id
              },
              'Hủy  đơn hàng',
              'Bạn chắc chắn muốn hủy đơn hàng này?',
              () => {
                utils.Order.invalidate();
              }
            );
          }}
        >
          <IconXboxX size={24} />
        </ActionIcon>
      </Tooltip>
    </>
  );
}
