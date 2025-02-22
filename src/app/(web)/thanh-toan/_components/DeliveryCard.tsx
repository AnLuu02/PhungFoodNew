'use client';

import { Card, Group, Select, Stack, Textarea, TextInput, Title } from '@mantine/core';
import { useSession } from 'next-auth/react';
import { Controller } from 'react-hook-form';

export default function DeliveryCard({ control }: { control: any }) {
  const { data: user } = useSession();

  return (
    <Card shadow='sm' padding='lg' radius='md' withBorder>
      <Title order={2} className='mb-4 font-quicksand text-xl'>
        Thông tin vận chuyển
      </Title>
      <Stack gap='md'>
        <Group grow>
          <Controller
            name='email'
            control={control}
            defaultValue={user?.user?.email || 'anluu0099@gmail.com'}
            render={({ field, fieldState }) => (
              <TextInput label='Email' placeholder='Email' {...field} error={fieldState.error?.message} />
            )}
          />
          <Controller
            name='name'
            control={control}
            defaultValue={user?.user?.name || 'Ann Luu'}
            render={({ field, fieldState }) => (
              <TextInput label='Họ và tên' placeholder='Họ và tên' {...field} error={fieldState.error?.message} />
            )}
          />
        </Group>

        <Group grow>
          <Controller
            name='phone'
            control={control}
            defaultValue=''
            render={({ field, fieldState }) => (
              <TextInput
                label='Số điện thoại'
                placeholder='Số điện thoại (tùy chọn)'
                leftSection={<Select data={['+84']} defaultValue='+84' variant='unstyled' w={70} />}
                {...field}
                error={fieldState.error?.message}
              />
            )}
          />
          <Controller
            name='province'
            control={control}
            defaultValue=''
            render={({ field, fieldState }) => (
              <Select
                label='Tỉnh thành'
                placeholder='Tỉnh thành'
                data={['Hà Nội', 'TP HCM', 'Đà Nẵng']}
                {...field}
                error={fieldState.error?.message}
              />
            )}
          />
        </Group>

        <Controller
          name='address'
          control={control}
          defaultValue=''
          render={({ field, fieldState }) => (
            <Textarea
              label='Địa chỉ'
              placeholder='Địa chỉ cụ thể (đường, phố, quận, huyện,...)'
              {...field}
              error={fieldState.error?.message}
            />
          )}
        />

        <Controller
          name='note'
          control={control}
          defaultValue=''
          render={({ field }) => <Textarea label='Ghi chú' placeholder='Ghi chú (tùy chọn)' {...field} />}
        />
      </Stack>
    </Card>
  );
}
