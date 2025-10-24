'use client';

import { Box, Grid, GridCol, Paper, Text, TextInput, Title } from '@mantine/core';
import { IconPhone } from '@tabler/icons-react';
import { Controller } from 'react-hook-form';
export default function ContactTab({ control }: { control: any }) {
  return (
    <Paper radius={'md'} shadow='md' p={'lg'} className='bg-gray-100 dark:bg-dark-card'>
      <Box mb={'md'}>
        <Title order={4} className='flex items-center gap-2 font-quicksand'>
          <IconPhone className='h-5 w-5' />
          Thông tin liên hệ
        </Title>
        <Text fw={600} size={'sm'} c={'dimmed'}>
          Cập nhật thông tin liên lạc và vị trí của nhà hàng của bạn
        </Text>
      </Box>
      <Box className='space-y-4'>
        <Grid>
          <GridCol span={6}>
            <Controller
              control={control}
              name='email'
              render={({ field, fieldState }) => (
                <TextInput
                  {...field}
                  type='email'
                  label='Email'
                  radius='md'
                  placeholder='restaurant@example.com'
                  error={fieldState.error?.message}
                />
              )}
            />
          </GridCol>
          <GridCol span={6}>
            <Controller
              control={control}
              name='phone'
              render={({ field, fieldState }) => (
                <TextInput
                  {...field}
                  label='Số điện thoại'
                  radius='md'
                  placeholder='+1 (555) 123-4567'
                  error={fieldState.error?.message}
                />
              )}
            />
          </GridCol>
          <GridCol span={12}>
            <Controller
              control={control}
              name='address'
              render={({ field, fieldState }) => (
                <TextInput
                  {...field}
                  label='Địa chỉ'
                  radius='md'
                  placeholder='123 Main Street, City, State 12345'
                  error={fieldState.error?.message}
                />
              )}
            />
          </GridCol>
          <GridCol span={12}>
            <Controller
              control={control}
              name='website'
              render={({ field, fieldState }) => (
                <TextInput
                  {...field}
                  label='Website'
                  radius='md'
                  placeholder='https://yourrestaurant.com'
                  error={fieldState.error?.message}
                />
              )}
            />
          </GridCol>
        </Grid>
      </Box>
    </Paper>
  );
}
