import { Card, Grid, GridCol, Select, Stack, Textarea, TextInput, Title } from '@mantine/core';
import { IconMail, IconPhone, IconUser } from '@tabler/icons-react';
import { Controller } from 'react-hook-form';
import { DistrictResponse, ProvinceResponse, WardResponse } from '~/types/ResponseFetcher';

export function DeliveryCard({
  control,
  watch,
  provinces,
  districts,
  wards
}: {
  control: any;
  watch: any;
  provinces?: ProvinceResponse;
  districts?: DistrictResponse;
  wards?: WardResponse;
}) {
  return (
    <Card shadow='sm' padding='lg' radius='md' withBorder>
      <Title order={2} className='mb-4 font-quicksand text-xl'>
        Thông tin vận chuyển
      </Title>
      <Stack gap='md'>
        <Grid>
          <GridCol span={12}>
            <Controller
              name='email'
              control={control}
              render={({ field, fieldState }) => (
                <TextInput
                  label='Email'
                  placeholder='Email'
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
              name='name'
              control={control}
              render={({ field, fieldState }) => (
                <TextInput
                  leftSection={<IconUser size={18} stroke={1.5} />}
                  label='Họ và tên'
                  placeholder='Họ và tên'
                  {...field}
                  withAsterisk
                  error={fieldState.error?.message}
                />
              )}
            />
          </GridCol>
          <GridCol span={12}>
            <Controller
              name='phone'
              control={control}
              defaultValue=''
              render={({ field, fieldState }) => (
                <TextInput
                  {...field}
                  label='Số điện thoại'
                  leftSection={<IconPhone size={18} stroke={1.5} />}
                  placeholder='Số điện thoại'
                  withAsterisk
                  error={fieldState.error?.message}
                />
              )}
            />
          </GridCol>
          <GridCol span={12}>
            <Controller
              control={control}
              name={`address.provinceId`}
              render={({ field, fieldState }) => (
                <Select
                  {...field}
                  searchable
                  radius='md'
                  label='Tỉnh thành'
                  placeholder='Chọn tỉnh thành'
                  data={provinces?.results?.map((item: any) => ({
                    value: item.province_id,
                    label: item.province_name
                  }))}
                  withAsterisk
                  nothingFoundMessage='Nothing found...'
                  error={fieldState.error?.message}
                />
              )}
            />
          </GridCol>
          <GridCol span={12}>
            <Controller
              control={control}
              name={`address.districtId`}
              disabled={!watch('address.provinceId')}
              render={({ field, fieldState }) => (
                <Select
                  {...field}
                  searchable
                  radius='md'
                  label='Quận huyện'
                  placeholder='Chọn quận huyện'
                  data={districts?.results?.map((item: any) => ({
                    value: item.district_id,
                    label: item.district_name
                  }))}
                  withAsterisk
                  nothingFoundMessage='Nothing found...'
                  error={fieldState.error?.message}
                />
              )}
            />
          </GridCol>
          <GridCol span={12}>
            <Controller
              control={control}
              name={`address.wardId`}
              disabled={!watch('address.districtId')}
              render={({ field, fieldState }) => (
                <Select
                  {...field}
                  searchable
                  radius='md'
                  label='Phường xã'
                  placeholder='Chọn phường xã'
                  data={wards?.results?.map((item: any) => ({
                    value: item.ward_id,
                    label: item.ward_name
                  }))}
                  withAsterisk
                  nothingFoundMessage='Nothing found...'
                  error={fieldState.error?.message}
                />
              )}
            />
          </GridCol>
          <GridCol span={12}>
            <Controller
              control={control}
              name={`address.detail`}
              render={({ field, fieldState }) => (
                <Textarea
                  {...field}
                  label='Địa chỉ'
                  placeholder='Địa chỉ cụ thể (đường, phố, quận, huyện,...)'
                  resize='block'
                  withAsterisk
                  error={fieldState.error?.message}
                />
              )}
            />
          </GridCol>
          <GridCol span={12}>
            <Controller
              name='note'
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
