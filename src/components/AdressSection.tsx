import { GridCol, Select, Textarea } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { useEffect } from 'react';
import { Control, Controller, UseFormSetValue, useWatch } from 'react-hook-form';
import { useDistricts, useProvinces, useWards } from '~/components/Hooks/use-fetch';
import { District, Province, Ward } from '~/types/ResponseFetcher';

export default function AddressSection({
  control,
  setValue
}: {
  control: Control<any>;
  setValue: UseFormSetValue<any>;
}) {
  const address = useWatch({
    control,
    name: 'address'
  });

  const { provinces, getProvince } = useProvinces();
  const [debouncedProvinceId] = useDebouncedValue(address?.provinceId, 300);
  const [debouncedDistrictId] = useDebouncedValue(address?.districtId, 300);
  const { districts, getDistrict } = useDistricts(debouncedProvinceId);
  const { wards, getWard } = useWards(debouncedDistrictId);
  useEffect(() => {
    const province = getProvince(address?.provinceId, provinces);
    const district = getDistrict(address?.districtId, districts);
    const ward = getWard(address?.wardId, wards);
    const fullAddress = `${address?.detail + ', ' || ''}${ward?.name || ''}, ${district?.name || ''}, ${province?.name || ''}`;
    setValue('address.province', province?.name || '');
    setValue('address.district', district?.name || '');
    setValue('address.ward', ward?.name || '');
    setValue('address.fullAddress', fullAddress);
  }, [address?.provinceId, address?.districtId]);
  return (
    <>
      <GridCol span={4}>
        <Controller
          control={control}
          name='address.provinceId'
          render={({ field, fieldState: { error } }) => (
            <Select
              {...field}
              radius={'md'}
              searchable
              label='Tỉnh thành'
              placeholder='Tỉnh thành'
              data={provinces.map((item: Province) => ({
                value: item.code.toString(),
                label: item.name
              }))}
              nothingFoundMessage='Không tìm thấy...'
              error={error?.message}
            />
          )}
        />
      </GridCol>

      <GridCol span={4}>
        <Controller
          control={control}
          name='address.districtId'
          disabled={!address?.provinceId}
          render={({ field, fieldState: { error } }) => (
            <Select
              radius={'md'}
              {...field}
              searchable
              label='Quận huyện'
              placeholder='Quận huyện'
              data={districts.map((item: District) => ({
                value: item.code.toString(),
                label: item.name
              }))}
              nothingFoundMessage='Không tìm thấy...'
              error={error?.message}
            />
          )}
        />
      </GridCol>

      <GridCol span={4}>
        <Controller
          control={control}
          name='address.wardId'
          disabled={!address?.districtId}
          render={({ field, fieldState: { error } }) => (
            <Select
              {...field}
              radius={'md'}
              label='Phường xã'
              searchable
              placeholder='Phường xã'
              data={wards.map((item: Ward) => ({
                value: item.code.toString(),
                label: item.name
              }))}
              nothingFoundMessage='Không tìm thấy...'
              error={error?.message}
            />
          )}
        />
      </GridCol>

      <GridCol span={12}>
        <Controller
          control={control}
          name='address.detail'
          render={({ field, fieldState: { error } }) => (
            <Textarea
              {...field}
              radius={'md'}
              label='Địa chỉ'
              placeholder='Địa chỉ cụ thể (số nhà, đường, phường,...)'
              resize='block'
              error={error?.message}
            />
          )}
        />
      </GridCol>
    </>
  );
}
