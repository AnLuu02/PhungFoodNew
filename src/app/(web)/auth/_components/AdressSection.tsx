'use client';

import { GridCol, Select, Textarea } from '@mantine/core';
import { Controller } from 'react-hook-form';

interface Props {
  control: any;
  errors: any;
  watch: any;
  provinces: any;
  districts: any;
  wards: any;
}

export default function AddressSection({ control, errors, watch, provinces, districts, wards }: Props) {
  return (
    <>
      <GridCol span={12}>
        <Controller
          control={control}
          name='address.provinceId'
          render={({ field }) => (
            <Select
              {...field}
              searchable
              placeholder='Chọn tỉnh thành'
              data={provinces?.results?.map((item: any) => ({
                value: item.province_id,
                label: item.province_name
              }))}
              nothingFoundMessage='Không tìm thấy...'
              error={errors?.address?.province?.message}
            />
          )}
        />
      </GridCol>

      <GridCol span={12}>
        <Controller
          control={control}
          name='address.districtId'
          disabled={!watch('address.provinceId')}
          render={({ field }) => (
            <Select
              {...field}
              searchable
              placeholder='Chọn quận huyện'
              data={districts?.results?.map((item: any) => ({
                value: item.district_id,
                label: item.district_name
              }))}
              nothingFoundMessage='Không tìm thấy...'
              error={errors?.address?.district?.message}
            />
          )}
        />
      </GridCol>

      <GridCol span={12}>
        <Controller
          control={control}
          name='address.wardId'
          disabled={!watch('address.districtId')}
          render={({ field }) => (
            <Select
              {...field}
              searchable
              placeholder='Chọn phường xã'
              data={wards?.results?.map((item: any) => ({
                value: item.ward_id,
                label: item.ward_name
              }))}
              nothingFoundMessage='Không tìm thấy...'
              error={errors?.address?.ward?.message}
            />
          )}
        />
      </GridCol>

      <GridCol span={12}>
        <Controller
          control={control}
          name='address.detail'
          render={({ field }) => (
            <Textarea
              {...field}
              label='Địa chỉ'
              placeholder='Địa chỉ cụ thể (số nhà, đường, phường,...)'
              resize='block'
              error={errors?.address?.detail?.message}
            />
          )}
        />
      </GridCol>
    </>
  );
}
