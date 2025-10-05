'use client';

import {
  Box,
  Button,
  Grid,
  GridCol,
  Group,
  NumberInput,
  Paper,
  Select,
  Stack,
  Switch,
  Text,
  Title
} from '@mantine/core';
import {
  IconCreditCard,
  IconDatabase,
  IconDownload,
  IconShield,
  IconSpacingVertical,
  IconUpload
} from '@tabler/icons-react';

export default function SecuritySettingsManagement({ data }: { data: any }) {
  return (
    <>
      <Paper withBorder p='md' radius='md'>
        <form>
          <Stack gap={'xl'}>
            <Group justify='space-between'>
              <Box>
                <Title className='flex items-center gap-2 font-quicksand' order={3}>
                  <IconCreditCard size={20} />
                  Bảo mật
                </Title>
                <Text fw={600} size={'sm'} c={'dimmed'}>
                  Quản lý cài đặt bảo mật
                </Text>
              </Box>
              <Button
                className='bg-mainColor duration-100 hover:bg-subColor hover:text-black'
                radius={'md'}
                type='submit'
                leftSection={<IconSpacingVertical size={16} />}
              >
                Lưu thay đổi
              </Button>
            </Group>

            <Paper radius={'md'} shadow='md' p={'lg'} className='bg-gray-100 dark:bg-dark-card'>
              <Title className='font-quicksand' order={4} mb={'md'}>
                Phiên làm việc
              </Title>
              <Grid>
                <GridCol span={6}>
                  <NumberInput
                    radius={'md'}
                    label={`Thời gian hết hạn phiên (phút)`}
                    size='sm'
                    min={5}
                    withAsterisk
                    defaultValue={30}
                  />
                </GridCol>
                <GridCol span={6}>
                  <NumberInput
                    radius={'md'}
                    label={`Số lần đăng nhập tối đa`}
                    size='sm'
                    min={5}
                    withAsterisk
                    defaultValue={5}
                  />
                </GridCol>
                <GridCol span={6}>
                  <NumberInput
                    radius={'md'}
                    label={`Thời gian khóa tài khoản (phút)`}
                    size='sm'
                    min={15}
                    defaultValue={15}
                    withAsterisk
                  />
                </GridCol>
              </Grid>
            </Paper>

            <Paper withBorder radius={'md'} shadow='md' p={'lg'} className='bg-gray-100 dark:bg-dark-card'>
              <Box mb={'md'}>
                <Title className='flex items-center gap-4 font-quicksand' order={4}>
                  <IconShield size={20} /> Cài đặt bảo mật
                </Title>
                <Text size='sm'>Quản lý bảo mật và kiểm soát truy cập</Text>
              </Box>
              <Box>
                <Stack gap='md'>
                  <Stack gap='xs'>
                    <NumberInput
                      label={'Thời gian chờ của phiên (phút)'}
                      id='sessionTimeout'
                      defaultValue={30}
                      min={1}
                    />
                  </Stack>

                  <Stack gap='xs'>
                    <Select
                      defaultValue='medium'
                      label='Chính sách mật khẩu'
                      data={[
                        { value: 'low', label: 'Thấp (8+ ký tự)' },
                        { value: 'medium', label: 'Trung bình (8+ ký tự, số)' },
                        { value: 'high', label: 'Cao (8+ ký tự, số, ký hiệu)' }
                      ]}
                    />
                  </Stack>

                  <Box display='flex' style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                    <Stack gap={2}>
                      <Text fw={600} size='sm'>
                        Xác thực hai yếu tố
                      </Text>
                      <Text size='sm' c='dimmed'>
                        Yêu cầu 2FA cho tất cả người dùng
                      </Text>
                    </Stack>
                    <Switch />
                  </Box>

                  <Box display='flex' style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                    <Stack gap={2}>
                      <Text fw={600} size='sm'>
                        Giới hạn số lần đăng nhập
                      </Text>
                      <Text size='sm' c='dimmed'>
                        Khóa tài khoản sau khi thử không thành công
                      </Text>
                    </Stack>
                    <Switch defaultChecked />
                  </Box>
                </Stack>
              </Box>
            </Paper>

            <Paper shadow='md' radius='md' p='lg' withBorder>
              <Stack gap='md'>
                <Stack gap={2}>
                  <Group gap={8}>
                    <IconDatabase size={20} />
                    <Title order={4}>Sao lưu và phục hồi</Title>
                  </Group>
                  <Text size='sm' c='dimmed'>
                    Quản lý các tùy chọn sao lưu và phục hồi dữ liệu
                  </Text>
                </Stack>

                <Stack gap='md'>
                  <Stack gap={4}>
                    <Select
                      label='Tần suất dự phòng'
                      defaultValue='daily'
                      data={[
                        { value: 'hourly', label: 'Hourly' },
                        { value: 'daily', label: 'Daily' },
                        { value: 'weekly', label: 'Weekly' },
                        { value: 'monthly', label: 'Monthly' }
                      ]}
                    />
                  </Stack>

                  <Stack gap={4}>
                    <NumberInput label='Thời gian lưu giữ (ngày)' id='retention' defaultValue={30} min={1} />
                  </Stack>

                  <Group>
                    <Button leftSection={<IconDownload size={16} />}>Tạo bản sao lưu ngay</Button>
                    <Button variant='outline' leftSection={<IconUpload size={16} />}>
                      Khôi phục từ bản sao lưu
                    </Button>
                  </Group>

                  <Box p='md' bg='var(--mantine-color-gray-light)' style={{ borderRadius: 8 }}>
                    <Title order={5} mb={6}>
                      Sao lưu lần cuối
                    </Title>
                    <Text size='sm' c='dimmed'>
                      Ngày 15 tháng 3 năm 2024 lúc 2:00 sáng
                    </Text>
                    <Text size='sm' c='dimmed'>
                      Size: 2.4 GB
                    </Text>
                  </Box>
                </Stack>
              </Stack>
            </Paper>

            <Group justify='flex-start'>
              <Button
                type='submit'
                leftSection={<IconSpacingVertical size={16} />}
                className='bg-mainColor duration-100 hover:bg-subColor hover:text-black'
                radius={'md'}
              >
                Lưu thay đổi
              </Button>
            </Group>
          </Stack>
        </form>
      </Paper>
    </>
  );
}
