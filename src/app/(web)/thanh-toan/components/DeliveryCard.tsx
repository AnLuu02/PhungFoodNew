import { Card, Grid, GridCol, Stack, Textarea, TextInput, Title } from '@mantine/core';
import { IconMail, IconPhone, IconUser } from '@tabler/icons-react';
import { Controller } from 'react-hook-form';
import AddressSection from '~/components/AdressSection';

export function DeliveryCard({ control, setValue, name }: { control: any; setValue: any; name: string }) {
  return (
    <Card shadow='sm' padding='lg' radius='md' withBorder>
      <Title order={2} className='mb-4 font-quicksand text-xl'>
        Thông tin vận chuyển
      </Title>
      <Stack gap='md'>
        <Grid>
          <GridCol span={12}>
            <Controller
              name={`${name}.email`}
              control={control}
              render={({ field, fieldState }) => (
                <TextInput
                  label='Email'
                  placeholder='Email'
                  radius={'md'}
                  type='email'
                  leftSection={<IconMail size={18} stroke={1.5} />}
                  {...field}
                  withAsterisk
                  error={fieldState.error?.message}
                />
              )}
            />
          </GridCol>
          <GridCol span={12}>
            <Controller
              name={`${name}.name`}
              control={control}
              render={({ field, fieldState }) => (
                <TextInput
                  leftSection={<IconUser size={18} stroke={1.5} />}
                  label='Họ và tên'
                  placeholder='Họ và tên'
                  radius={'md'}
                  {...field}
                  withAsterisk
                  error={fieldState.error?.message}
                />
              )}
            />
          </GridCol>
          <GridCol span={12}>
            <Controller
              name={`${name}.phone`}
              control={control}
              defaultValue=''
              render={({ field, fieldState }) => (
                <TextInput
                  {...field}
                  label='Số điện thoại'
                  radius={'md'}
                  leftSection={<IconPhone size={18} stroke={1.5} />}
                  placeholder='Số điện thoại'
                  withAsterisk
                  error={fieldState.error?.message}
                />
              )}
            />
          </GridCol>
          <AddressSection control={control} setValue={setValue} name={`${name}.address`} />
          <GridCol span={12}>
            <Controller
              name={`${name}.note`}
              control={control}
              defaultValue=''
              render={({ field }) => (
                <Textarea resize='block' label='Ghi chú' placeholder='Ghi chú (tùy chọn)' {...field} />
              )}
            />
          </GridCol>
        </Grid>
      </Stack>
    </Card>
  );
}
