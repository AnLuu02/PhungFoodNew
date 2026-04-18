import { Select, SimpleGrid, Textarea } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { useEffect } from 'react';
import { Controller, useWatch } from 'react-hook-form';
import { useDistricts, useProvinces, useWards } from '~/components/Hooks/use-fetch';
import { District, Province, Ward } from '~/types/ResponseFetcher';

export default function AddressSection({
  control,
  setValue,
  cols,
  name = 'address'
}: {
  control: any;
  cols?: number;
  setValue: any;
  name?: string;
}) {
  const validName = name.includes('address') ? name : name + '.address';
  const address = useWatch({ control, name: validName });
  const { provinces, getProvince } = useProvinces();
  const [dbProvinceId] = useDebouncedValue(address?.provinceId, 300);
  const [dbDistrictId] = useDebouncedValue(address?.districtId, 300);
  const { districts, getDistrict } = useDistricts(dbProvinceId);
  const { wards, getWard } = useWards(dbDistrictId);
  useEffect(() => {
    if (!address?.provinceId && !address?.detail) return setValue('address', undefined);
    const p = getProvince(address?.provinceId, provinces);
    const d = getDistrict(address?.districtId, districts);
    const w = getWard(address?.wardId, wards);
    const fullAddress = [address.detail, w?.name, d?.name, p?.name].filter(Boolean).join(', ');
    const updates = {
      province: p?.name || '',
      district: d?.name || '',
      ward: w?.name || '',
      fullAddress
    };
    Object.entries(updates).forEach(([key, val]) => setValue(`${validName}.${key}`, val));
  }, [address?.provinceId, address?.districtId, address?.wardId, address?.detail]);
  return (
    <>
      <SimpleGrid cols={cols || 1}>
        <Controller
          control={control}
          name={`${validName}.provinceId`}
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

        <Controller
          control={control}
          name={`${validName}.districtId`}
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
              disabled={!address?.provinceId}
              nothingFoundMessage='Không tìm thấy...'
              error={error?.message}
            />
          )}
        />

        <Controller
          control={control}
          name={`${validName}.wardId`}
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
              disabled={!address?.districtId}
              error={error?.message}
            />
          )}
        />
      </SimpleGrid>
      <Controller
        control={control}
        name={`${validName}.detail`}
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
    </>
  );
}
