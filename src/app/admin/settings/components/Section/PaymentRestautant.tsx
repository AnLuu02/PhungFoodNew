'use client';

import {
  ActionIcon,
  Box,
  Grid,
  GridCol,
  Group,
  Paper,
  Select,
  Stack,
  Switch,
  Text,
  TextInput,
  Title
} from '@mantine/core';
import { IconCreditCard, IconSettings, IconSpacingVertical } from '@tabler/icons-react';
import { useState } from 'react';
import BButton from '~/components/Button/Button';
import { api } from '~/trpc/react';

export default function PaymentSettingsManagement() {
  const { data } = api.Payment.getAll.useQuery();
  const payments = data?.data || [];
  const [selectedPayment, setSelectedPayment] = useState('vnpay');
  return (
    <>
      <Paper withBorder p='md' radius='md'>
        <form>
          <Stack gap={'xl'}>
            <Group justify='space-between'>
              <Box>
                <Title className='flex items-center gap-2 font-quicksand' order={3}>
                  <IconCreditCard size={20} />
                  Thanh toán
                </Title>
                <Text fw={600} size={'sm'} c={'dimmed'}>
                  Quản lý cài đặt thanh toán
                </Text>
              </Box>
              <BButton type='submit' leftSection={<IconSpacingVertical size={16} />}>
                Lưu thay đổi
              </BButton>
            </Group>

            <Paper radius={'md'} shadow='md' p={'lg'} className='bg-gray-100 dark:bg-dark-card'>
              <Title className='font-quicksand' order={4} mb={'md'}>
                Cổng thanh toán
              </Title>
              <Grid>
                {payments?.map((item: any, index: number) => (
                  <GridCol span={6} key={index}>
                    <Stack>
                      <Stack gap={4}>
                        <Group align='center' gap={4}>
                          <Text size='sm' fw={700}>
                            Kích hoạt {item.name}
                          </Text>
                          <ActionIcon variant='transparent'>
                            <IconSettings size={16} />
                          </ActionIcon>
                        </Group>
                        <Switch
                          size='sm'
                          value={item.provider}
                          checked={selectedPayment === item.provider}
                          onChange={() => {
                            setSelectedPayment(item.provider);
                          }}
                        />
                      </Stack>
                      {selectedPayment === item.provider && (
                        <>
                          <TextInput
                            radius={'md'}
                            label={`${item.name} Merchant ID`}
                            size='sm'
                            withAsterisk
                            placeholder={`Nhập ${item.name} Merchant ID`}
                            defaultValue={''}
                          />

                          <TextInput
                            radius={'md'}
                            label={`${item.name} Secret Key`}
                            size='sm'
                            withAsterisk
                            placeholder={`Nhập ${item.name} Secret Key`}
                            defaultValue={''}
                          />
                        </>
                      )}
                    </Stack>
                  </GridCol>
                ))}
              </Grid>
            </Paper>

            <Paper radius='md' shadow='md' p={'lg'} className='bg-gray-100 dark:bg-dark-card'>
              <Title className='font-quicksand' order={4} mb='md'>
                Cài đặt giá
              </Title>

              <Grid>
                <GridCol span={6}>
                  <Select
                    radius='md'
                    label='Đơn vị tiền tệ'
                    size='sm'
                    data={[
                      { value: 'vnd', label: 'VND' },
                      { value: 'usd', label: 'USD' },
                      { value: 'eur', label: 'Euro' }
                    ]}
                    defaultValue='vnd'
                  />
                </GridCol>
                <GridCol span={6}>
                  <TextInput
                    radius={'md'}
                    label={`Thuế VAT (%)`}
                    size='sm'
                    withAsterisk
                    placeholder={`Nhập Thuế`}
                    defaultValue={''}
                  />
                </GridCol>
              </Grid>
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
