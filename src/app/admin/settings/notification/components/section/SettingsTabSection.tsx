'use client';

import { Box, Card, Paper, Switch, Text, TextInput } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import BButton from '~/components/Button/Button';
import { NotifySuccess } from '~/lib/FuncHandler/toast';

export const SettingsTabSection = () => {
  const handleDeleteAutoRule = (ruleId: string) => {
    NotifySuccess('Auto-notification rule deleted');
  };
  const handleResetSettings = () => {
    NotifySuccess('Settings reset to defaults');
  };
  const handleSaveSettings = () => {
    NotifySuccess('Settings saved successfully');
  };

  const handleEditAutoRule = (rule: any) => {};
  const autoRules = [
    {
      id: '1',
      name: 'Chào mừng người dùng mới',
      trigger: 'user_registration',
      template: 'welcome',
      enabled: true,
      conditions: { userType: 'new' },
      delay: 0
    },
    {
      id: '2',
      name: 'Xác nhận đơn hàng',
      trigger: 'order_placed',
      template: 'order-confirm',
      enabled: true,
      conditions: { orderStatus: 'confirmed' },
      delay: 0
    },
    {
      id: '3',
      name: 'Cập nhật giao hàng',
      trigger: 'order_status_change',
      template: 'delivery-update',
      enabled: true,
      conditions: { orderStatus: 'out_for_delivery' },
      delay: 0
    }
  ];
  return (
    <>
      <Box className='grid gap-6 md:grid-cols-2'>
        <Card withBorder radius={'lg'}>
          <Box mb={'md'}>
            <Text size='xl' fw={700}>
              Cập nhật theo thời gian thực
            </Text>
            <Text size='sm'>Cho phép cập nhật trạng thái trực tiếp cho thông báo</Text>
          </Box>
          <Box className='flex items-center justify-between'>
            <Box>
              <Text fw={700}>Cập nhật trạng thái trực tiếp</Text>
              <Text className='text-sm'>Tự động cập nhật trạng thái thông báo theo thời gian thực</Text>
            </Box>
            <Switch checked />
          </Box>
        </Card>

        <Card withBorder radius={'lg'}>
          <Box mb={'md'}>
            <Text size='xl' fw={700}>
              Giới hạn tỷ lệ
            </Text>
            <Text size='sm'>Kiểm soát tần suất thông báo</Text>
          </Box>
          <Box className='space-y-4'>
            <Box className='space-y-2'>
              <TextInput radius={'md'} type='number' label='Giới hạn hàng ngày cho mỗi người dùng' />
            </Box>
            <Box className='space-y-2'>
              <TextInput radius={'md'} type='number' label='Giới hạn theo giờ cho mỗi người dùng' />
            </Box>
            <Box className='space-y-2'>
              <TextInput radius={'md'} label='Khoảng cách tối thiểu (phút)' type='number' />
            </Box>
          </Box>
        </Card>

        <Card withBorder radius={'lg'}>
          <Box mb={'md'}>
            <Text size='xl' fw={700}>
              Cài đặt mặc định
            </Text>
            <Text size='sm'>Thông báo mặc định ưu tiên cho người dùng mới</Text>
          </Box>
          <Box className='space-y-4'>
            <Box className='grid grid-cols-2 gap-4'>
              {[
                { id: 'email', label: 'Email', key: 'email' },
                { id: 'push', label: 'Push', key: 'push' },
                { id: 'sms', label: 'SMS', key: 'sms' },
                { id: 'inApp', label: 'In-App', key: 'inApp' }
              ].map(({ id, label, key }) => (
                <Box key={id} className='flex items-center space-x-2'>
                  <Switch label={label} radius={'md'} />
                </Box>
              ))}
            </Box>
          </Box>
        </Card>

        <Card withBorder radius={'lg'}>
          <Box mb={'md'}>
            <Text size='xl' fw={700}>
              Giờ yên tĩnh toàn cầu
            </Text>
            <Text size='sm'>Đặt giờ yên tĩnh trên toàn hệ thống</Text>
          </Box>
          <Box className='space-y-4'>
            <Box className='flex items-center space-x-2'>
              <Switch radius={'md'} label='Bật Giờ Yên Tĩnh' />
            </Box>
            <Box className='grid grid-cols-2 gap-4'>
              <Box className='space-y-2'>
                <TextInput label=' Thời gian bắt đầu' radius={'md'} type='time' />
              </Box>
              <Box className='space-y-2'>
                <TextInput label='Thời gian kết thúc' radius={'md'} type='time' />
              </Box>
            </Box>
          </Box>
        </Card>
      </Box>

      <Card withBorder radius={'lg'}>
        <Box mb={'md'}>
          <Box className='flex items-center justify-between'>
            <Box>
              <Text size='xl' fw={700}>
                Quy tắc thông báo tự động
              </Text>
              <Text size='sm'>Tự động gửi thông báo dựa trên sự kiện</Text>
            </Box>
            <BButton leftSection={<IconPlus size={18} />}>Thêm thông báo tự động</BButton>
          </Box>
        </Box>
        <Box>
          <Box className='space-y-4'>
            {autoRules.map((rule: any) => (
              <Paper withBorder radius={'lg'} key={rule.id} className='flex items-center justify-between p-4'>
                <Box className='flex items-center gap-3'>
                  <Switch checked={rule.enabled} />
                  <Box>
                    <Text fw={700}>{rule.name}</Text>
                    <Text size='sm'>
                      Trigger: {rule.trigger.replace('_', ' ')}
                      {rule.delay && rule.delay > 0 && ` • Delay: ${rule.delay}min`}
                    </Text>
                  </Box>
                </Box>
                <Box className='flex gap-2'>
                  <BButton size='sm' onClick={() => handleEditAutoRule(rule)}>
                    Chỉnh sửa
                  </BButton>
                  <BButton size='sm' className='bg-red-500' onClick={() => handleDeleteAutoRule(rule.id)}>
                    Xóa
                  </BButton>
                </Box>
              </Paper>
            ))}
          </Box>
        </Box>
      </Card>

      <Box className='flex justify-end gap-3'>
        <BButton variant='outline' onClick={handleResetSettings}>
          Đặt lại
        </BButton>
        <BButton onClick={handleSaveSettings}>Lưu cài đặt</BButton>
      </Box>
    </>
  );
};
