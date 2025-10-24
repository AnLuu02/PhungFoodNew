'use client';

import {
  Box,
  Divider,
  Grid,
  GridCol,
  Group,
  Paper,
  Stack,
  Switch,
  Text,
  TextInput,
  Textarea,
  Title
} from '@mantine/core';
import { IconMail, IconSpacingVertical } from '@tabler/icons-react';
import { useState } from 'react';
import BButton from '~/components/Button/Button';

export default function EmailSettingsManagement({ data }: { data: any }) {
  const [subject, setSubject] = useState('Chào mừng bạn đến với PhungFood');
  const [content, setContent] = useState('Xin chào {{name}},\nCảm ơn bạn đã đăng ký với email {{email}}!');

  const renderPreview = () => {
    return content.replace('{{name}}', 'Nguyễn Văn A').replace('{{email}}', 'nguyenvana@example.com');
  };
  return (
    <>
      <Paper withBorder p='md' radius='md'>
        <form>
          <Stack gap={'xl'}>
            <Group justify='space-between'>
              <Box>
                <Title className='flex items-center gap-2 font-quicksand' order={3}>
                  <IconMail size={20} />
                  Email
                </Title>
                <Text fw={600} size={'sm'} c={'dimmed'}>
                  Quản lý cài đặt email
                </Text>
              </Box>
              <BButton type='submit' leftSection={<IconSpacingVertical size={16} />}>
                Lưu thay đổi
              </BButton>
            </Group>

            <Paper radius={'md'} shadow='md' p={'lg'} className='bg-gray-100 dark:bg-dark-card'>
              <Title className='font-quicksand' order={4} mb={'md'}>
                Cấu hình SMTP
              </Title>
              <Grid>
                <GridCol span={6}>
                  <TextInput
                    radius={'md'}
                    label='SMTP Host'
                    size='sm'
                    withAsterisk
                    placeholder='Nhập SMTP Host email'
                    defaultValue={''}
                  />
                </GridCol>
                <GridCol span={6}>
                  <TextInput
                    radius={'md'}
                    label='SMTP Port'
                    size='sm'
                    withAsterisk
                    placeholder='Nhập SMTP Port email'
                    defaultValue={''}
                  />
                </GridCol>
                <GridCol span={6}>
                  <TextInput
                    radius={'md'}
                    label='Email'
                    size='sm'
                    withAsterisk
                    placeholder='Nhập email nhà hàng'
                    defaultValue={''}
                  />
                </GridCol>
                <GridCol span={6}>
                  <TextInput
                    radius={'md'}
                    label='Mật khẩu'
                    size='sm'
                    withAsterisk
                    placeholder='Nhập mật khẩu email tương ứng'
                    defaultValue={''}
                  />
                </GridCol>
                <GridCol span={6}>
                  <Stack>
                    <Text size='sm' fw={700}>
                      Sử dụng SSL/TLS
                    </Text>
                    <Switch size='sm' defaultChecked />
                  </Stack>
                </GridCol>
              </Grid>
            </Paper>

            <Paper radius='md' shadow='md' p={'lg'} className='bg-gray-100 dark:bg-dark-card'>
              <Title className='font-quicksand' order={4} mb='md'>
                Mẫu email gửi khách hàng
              </Title>

              <Grid>
                <GridCol span={12}>
                  <TextInput
                    radius='md'
                    label='Tiêu đề email'
                    size='sm'
                    placeholder='Nhập tiêu đề email'
                    value={subject}
                    onChange={e => setSubject(e.currentTarget.value)}
                  />
                </GridCol>

                <GridCol span={12}>
                  <Textarea
                    radius='md'
                    label='Nội dung email'
                    size='sm'
                    placeholder='Nhập nội dung email'
                    minRows={6}
                    value={content}
                    onChange={e => setContent(e.currentTarget.value)}
                  />
                  <Text size='xs' c='dimmed' mt={4}>
                    Bạn có thể sử dụng biến: <code>{'{{name}}'}</code>, <code>{'{{email}}'}</code>
                  </Text>
                </GridCol>
              </Grid>

              <Divider my='md' />

              <Box className='rounded-lg bg-white p-4 shadow dark:bg-dark-background'>
                <Text fw={700} mb='xs'>
                  Xem trước email
                </Text>
                <Paper p='md' radius='md' className='border border-gray-200'>
                  <Text fw={600} size='lg' mb='sm'>
                    {subject}
                  </Text>
                  <Text size='sm' className='whitespace-pre-line'>
                    {renderPreview()}
                  </Text>
                </Paper>
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
