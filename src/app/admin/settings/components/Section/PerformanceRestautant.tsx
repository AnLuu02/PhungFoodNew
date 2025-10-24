'use client';

import { Box, Grid, GridCol, Group, NumberInput, Paper, Stack, Switch, Text, Title } from '@mantine/core';
import { IconBell, IconCreditCard, IconSpacingVertical } from '@tabler/icons-react';
import { useState } from 'react';
import BButton from '~/components/Button/Button';

export default function PerformanceSettingsManagement({ data }: { data: any }) {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: true,
    orderAlerts: true,
    systemUpdates: false
  });
  const [isCache, setIsCache] = useState(false);
  return (
    <>
      <Paper withBorder p='md' radius='md'>
        <form onSubmit={e => e.preventDefault()}>
          <Stack gap={'xl'}>
            <Group justify='space-between'>
              <Box>
                <Title className='flex items-center gap-2 font-quicksand' order={3}>
                  <IconCreditCard size={20} />
                  Hiệu suất
                </Title>
                <Text fw={600} size={'sm'} c={'dimmed'}>
                  Quản lý cài đặt hiệu suất
                </Text>
              </Box>
              <BButton type='submit' leftSection={<IconSpacingVertical size={16} />}>
                Lưu thay đổi
              </BButton>
            </Group>

            <Paper radius={'md'} shadow='md' p={'lg'} className='bg-gray-100 dark:bg-dark-card'>
              <Title className='font-quicksand' order={4} mb={'md'}>
                Bộ nhớ đệm
              </Title>
              <Grid>
                <GridCol span={6}>
                  <Stack>
                    <Stack gap={4}>
                      <Text size='sm' fw={700}>
                        Kích hoạt cache
                      </Text>
                      <Switch
                        size='sm'
                        checked={isCache}
                        onChange={() => {
                          setIsCache(!isCache);
                        }}
                      />
                    </Stack>
                    {isCache && (
                      <>
                        <NumberInput
                          radius={'md'}
                          label={`Thời gian cache (milisecond)`}
                          size='sm'
                          withAsterisk
                          placeholder={`Nhập Thời gian cache (milisecond)`}
                          defaultValue={3600}
                        />
                      </>
                    )}
                  </Stack>
                </GridCol>

                <GridCol span={6}>
                  <Stack>
                    <Stack gap={4}>
                      <Text size='sm' fw={700}>
                        Sử dụng Redis
                      </Text>
                      <Switch size='sm' />
                    </Stack>
                  </Stack>
                </GridCol>
              </Grid>
            </Paper>

            <Paper withBorder radius={'md'} shadow='md' p={'lg'} className='bg-gray-100 dark:bg-dark-card'>
              <Box mb={'md'}>
                <Title className='flex items-center gap-4 font-quicksand' order={4}>
                  <IconBell size={20} /> Cài đặt thông báo
                </Title>
                <Text size='sm'>Cấu hình cách bạn nhận thông báo</Text>
              </Box>
              <Box className='space-y-6'>
                <Box className='flex items-center justify-between'>
                  <Box className='space-y-0.5'>
                    <label>
                      <Text fw={700}>Thông báo qua email</Text>
                    </label>
                    <Text size='sm' c={'dimmed'}>
                      Nhận thông báo qua email
                    </Text>
                  </Box>
                  <Switch
                    checked={notifications.email}
                    onChange={event => setNotifications(prev => ({ ...prev, email: event.currentTarget.checked }))}
                  />
                </Box>
                <Box className='flex items-center justify-between'>
                  <Box className='space-y-0.5'>
                    <label>
                      <Text fw={700}>Thông báo đẩy</Text>
                    </label>
                    <Text size='sm' c={'dimmed'}>
                      Thông báo đẩy của trình duyệt
                    </Text>
                  </Box>
                  <Switch
                    checked={notifications.push}
                    onChange={event => setNotifications(prev => ({ ...prev, push: event.currentTarget.checked }))}
                  />
                </Box>
                <Box className='flex items-center justify-between'>
                  <Box className='space-y-0.5'>
                    <label>
                      <Text fw={700}>Thông báo qua SMS</Text>
                    </label>
                    <Text size='sm' c={'dimmed'}>
                      Cảnh báo tin nhắn văn bản
                    </Text>
                  </Box>
                  <Switch
                    checked={notifications.sms}
                    onChange={event => setNotifications(prev => ({ ...prev, sms: event.currentTarget.checked }))}
                  />
                </Box>
                <Box className='flex items-center justify-between'>
                  <Box className='space-y-0.5'>
                    <label>
                      <Text fw={700}>Cảnh báo đặt hàng</Text>
                    </label>
                    <Text size='sm' c={'dimmed'}>
                      Thông báo đơn hàng mới
                    </Text>
                  </Box>
                  <Switch
                    checked={notifications.orderAlerts}
                    onChange={event =>
                      setNotifications(prev => ({ ...prev, orderAlerts: event.currentTarget.checked }))
                    }
                  />
                </Box>
                <Box className='flex items-center justify-between'>
                  <Box className='space-y-0.5'>
                    <label>
                      <Text fw={700}>Cập nhật hệ thống</Text>
                    </label>
                    <Text size='sm' c={'dimmed'}>
                      Thông báo bảo trì hệ thống
                    </Text>
                  </Box>
                  <Switch
                    checked={notifications.systemUpdates}
                    onChange={event =>
                      setNotifications(prev => ({ ...prev, systemUpdates: event.currentTarget.checked }))
                    }
                  />
                </Box>
              </Box>
            </Paper>

            <Group justify='flex-start'>
              <BButton type='submit' leftSection={<IconSpacingVertical size={16} />}>
                Lưu thay đổi
              </BButton>
            </Group>
          </Stack>
        </form>
      </Paper>
    </>
  );
}
