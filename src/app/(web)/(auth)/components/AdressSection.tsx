import { GridCol, Select, Textarea } from '@mantine/core';
import { Control, Controller, FieldErrors, UseFormWatch } from 'react-hook-form';
import { DistrictResponse, ProvinceResponse, WardResponse } from '~/types/ResponseFetcher';
import { User } from '~/types/user';

export default function AddressSection({
  control,
  errors,
  watch,
  provinces,
  districts,
  wards
}: {
  control: Control<User, any, User>;
  errors: FieldErrors<User>;
  watch: UseFormWatch<User>;
  provinces?: ProvinceResponse;
  districts?: DistrictResponse;
  wards?: WardResponse;
}) {
  return (
    <>
      <GridCol span={4}>
        <Controller
          control={control}
          name='address.provinceId'
          render={({ field }) => (
            <Select
              {...field}
              radius={'md'}
              searchable
              label='Tỉnh thành'
              placeholder='Tỉnh thành'
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

      <GridCol span={4}>
        <Controller
          control={control}
          name='address.districtId'
          disabled={!watch('address.provinceId')}
          render={({ field }) => (
            <Select
              radius={'md'}
              {...field}
              searchable
              label='Quận huyện'
              placeholder='Quận huyện'
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

      <GridCol span={4}>
        <Controller
          control={control}
          name='address.wardId'
          disabled={!watch('address.districtId')}
          render={({ field }) => (
            <Select
              {...field}
              radius={'md'}
              label='Phường xã'
              searchable
              placeholder='Phường xã'
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
              radius={'md'}
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
