'use client';

import {
  ActionIcon,
  Button,
  Drawer,
  Group,
  Modal,
  MultiSelect,
  Select,
  TextInput,
  Title,
  Tooltip
} from '@mantine/core';
import {
  IconCircleCheck,
  IconEdit,
  IconPlus,
  IconPrinter,
  IconTrash,
  IconTruckDelivery,
  IconXboxX
} from '@tabler/icons-react';
import { useState } from 'react';
import InvoiceToPrint from '~/components/InvoceToPrint';
import LoadingSpiner from '~/components/Loading/LoadingSpiner';
import { handleDelete } from '~/lib/button-handle/ButtonDeleteConfirm';
import { handleConfirm } from '~/lib/button-handle/ButtonHandleConfirm';
import { NotifyError, NotifySuccess } from '~/lib/func-handler/toast';
import { LocalOrderStatus } from '~/lib/zod/EnumType';
import { api } from '~/trpc/react';
import CreateOrder from './form/CreateOrder';
import UpdateOrder from './form/UpdateOrder';

export function CreateOrderButton() {
  const [opened, setOpened] = useState(false);
  return (
    <>
      <Button leftSection={<IconPlus size={16} />} onClick={() => setOpened(true)}>
        Tạo mới
      </Button>
      <Modal
        closeOnClickOutside={false}
        size={'100%'}
        opened={opened}
        onClose={() => setOpened(false)}
        title={<Title order={2}>Tạo hóa đơn</Title>}
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
    const res = await fetch('/api/send-invoice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: order?.user?.email || 'anluu0099@gmail.com',
        invoiceData: order
      })
    });

    const data = await res.json();
    if (data?.success) {
      NotifySuccess('Thành công!', 'Gửi hóa đơn thành công! ');
      setLoading(false);
    } else {
      NotifyError('Lỗi!', 'Đã có lỗi xảy ra.');
      setLoading(false);
    }
  };
  return (
    <>
      <Button
        leftSection={<IconPrinter size={16} />}
        color='green.9'
        variant='outline'
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
export function PrintOrderButton({ order }: any) {
  const [loading, setLoading] = useState(false);
  const sendTestEmail = async () => {
    setLoading(true);
    const res = await fetch('/api/send-invoice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: order?.user?.email || 'anluu0099@gmail.com',
        invoiceData: order
      })
    });

    const data = await res.json();
    if (data?.success) {
      NotifySuccess('Thành công!', 'Gửi hóa đơn thành công! ');
      setLoading(false);
    } else {
      NotifyError('Lỗi!', 'Đã có lỗi xảy ra.');
      setLoading(false);
    }
  };
  return (
    <>
      <Button
        leftSection={<IconPrinter size={16} />}
        color='green.9'
        variant='outline'
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
      <Tooltip label='Cập nhật hóa đơn'>
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
            <Title order={2}>Cập nhật hóa đơn</Title>

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
  const untils = api.useUtils();
  const deleteMutation = api.Order.delete.useMutation();

  return (
    <>
      <Tooltip label='Xóa hóa đơn'>
        <ActionIcon
          variant='subtle'
          color='red'
          onClick={() => {
            handleDelete({ id }, deleteMutation, 'hóa đơn', () => {
              untils.Order.invalidate();
            });
          }}
        >
          <IconTrash size={24} />
        </ActionIcon>
      </Tooltip>
    </>
  );
}

export function SuccessOrderButton({ id }: { id: string }) {
  const untils = api.useUtils();
  const mutation = api.Order.update.useMutation();

  return (
    <>
      <Tooltip label='Hoàn thành đơn hàng'>
        <ActionIcon
          variant='subtle'
          onClick={() => {
            handleConfirm(
              id,
              mutation,
              {
                where: {
                  id: id
                },
                data: {
                  status: LocalOrderStatus.COMPLETED
                }
              },
              'Hoàn thành đơn hàng',
              'Bạn chắc chắn muốn hoàn thành đơn hàng này?',
              () => {
                untils.Order.invalidate();
              }
            );
          }}
        >
          <IconCircleCheck size={24} />
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

  // 🔁 Fetch tất cả user khi mode là ALL hoặc SELECTED
  const { data: allUsers = [], isLoading: loadingUsers } = api.User.getAll.useQuery(undefined, {
    enabled: mode === 'ALL' || mode === 'SELECTED'
  });

  // 🔁 Fetch đơn hàng theo trạng thái (BY_STATUS)
  const { data: filteredOrders = [], isLoading: loadingOrders } = api.Order.getFilter.useQuery(
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
      body: JSON.stringify({ email: emails, data: data?.record || [] }),
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
      <Tooltip label='Gửi thông báo hàng loạt'>
        <Button variant='outline' onClick={() => setOpened(true)}>
          Gửi thông báo hàng loạt
        </Button>
      </Tooltip>

      <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        title={<Title order={3}>Gửi thông báo hàng loạt</Title>}
        position='right'
        size='lg'
      >
        <Select
          label='Chọn chế độ gửi'
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
            data={allUsers.map(u => ({
              value: u.id,
              label: u.name ? `${u.name} (${u.email})` : u.email
            }))}
            value={selectedUsers}
            onChange={setSelectedUsers}
            searchable
            mt='md'
            rightSection={loadingUsers ? <LoadingSpiner /> : undefined}
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
      body: JSON.stringify({ email, data: data?.record || [] }),
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
        title={<Title order={3}>Gửi thông báo cho khách hàng</Title>}
        position='right'
        size='md'
      >
        <TextInput label='Email' value={email} disabled />

        <Select
          label='Chọn mẫu thông báo (tùy chọn)'
          placeholder='Chọn mẫu hoặc để trống để nhập tay'
          data={messageTemplates}
          value={selectedTemplate}
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

export function DeliveryOrderButton({ id }: { id: string }) {
  const untils = api.useUtils();
  const mutation = api.Order.update.useMutation();

  return (
    <>
      <Tooltip label='Giao hàng'>
        <ActionIcon
          variant='subtle'
          onClick={() => {
            handleConfirm(
              id,
              mutation,
              {
                where: {
                  id: id
                },
                data: {
                  status: LocalOrderStatus.DELIVERED
                }
              },
              'Giao hàng',
              'Bạn chắc chắn muốn giao đơn hàng này?',
              () => {
                untils.Order.invalidate();
              }
            );
          }}
        >
          <IconTruckDelivery size={24} />
        </ActionIcon>
      </Tooltip>
    </>
  );
}

export function CancleOrderButton({ id }: { id: string }) {
  const untils = api.useUtils();
  const mutation = api.Order.update.useMutation();

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
                }
              },
              'Hủy  đơn hàng',
              'Bạn chắc chắn muốn hủy đơn hàng này?',
              () => {
                untils.Order.invalidate();
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
