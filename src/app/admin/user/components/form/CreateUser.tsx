'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ActionIcon,
  Avatar,
  Button,
  Center,
  FileInput,
  Grid,
  GridCol,
  PasswordInput,
  Select,
  Textarea,
  TextInput
} from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { useDebouncedValue } from '@mantine/hooks';
import { IconCalendar, IconFile, IconMail, IconPhone } from '@tabler/icons-react';
import type { Dispatch, SetStateAction } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import useSWR from 'swr';
import fetcher from '~/lib/func-handler/fetcher';
import { fileToBase64 } from '~/lib/func-handler/handle-file-base64';
import { NotifyError, NotifySuccess } from '~/lib/func-handler/toast';
import { LocalAddressType, LocalGender, LocalUserLevel } from '~/lib/zod/EnumType';
import { userSchema } from '~/lib/zod/zodShcemaForm';
import { api } from '~/trpc/react';
import { User } from '~/types/user';

export default function CreateUser({ setOpened }: { setOpened: Dispatch<SetStateAction<boolean>> }) {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isDirty }
  } = useForm<User>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      id: '',
      name: '',
      email: '',
      image: undefined,
      gender: LocalGender.OTHER,
      dateOfBirth: new Date('2000-01-01'),
      isActive: true,
      password: '',
      phone: '',
      address: {
        provinceId: '',
        districtId: '',
        wardId: '',
        province: '',
        district: '',
        ward: '',
        detail: '',
        type: LocalAddressType.USER
      },
      roleId: '',
      pointUser: 0,
      level: LocalUserLevel.BRONZE
    }
  });
  const { data: provinces } = useSWR<any>('https://api.vnappmob.com/api/v2/province/', fetcher);
  const [debouncedProvinceId] = useDebouncedValue(watch('address.provinceId'), 300);
  const [debouncedDistrictId] = useDebouncedValue(watch('address.districtId'), 300);

  const { data: districts } = useSWR<any>(
    debouncedProvinceId ? `https://api.vnappmob.com/api/v2/province/district/${debouncedProvinceId}` : null,
    fetcher
  );

  const { data: wards } = useSWR<any>(
    debouncedDistrictId ? `https://api.vnappmob.com/api/v2/province/ward/${debouncedDistrictId}` : null,
    fetcher
  );
  const utils = api.useUtils();
  const mutation = api.User.create.useMutation({
    onSuccess: () => {
      utils.User.invalidate();
    },
    onError: e => {
      NotifyError(e.message);
    }
  });

  const onSubmit: SubmitHandler<User> = async formData => {
    try {
      if (formData) {
        const file = formData?.image?.url as File;
        const fileName = file?.name || '';
        const base64 = file ? await fileToBase64(file) : '';

        const province = provinces?.results?.find((item: any) => item.province_id === formData?.address?.provinceId);
        const district = districts?.results?.find((item: any) => item.district_id === formData?.address?.districtId);
        const ward = wards?.results?.find((item: any) => item.ward_id === formData?.address?.wardId);
        const fullAddress = `${formData.address?.detail || ''}, ${ward?.ward_name || ''}, ${district?.district_name || ''}, ${province?.province_name || ''}`;

        const result = await mutation.mutateAsync({
          ...formData,
          image: {
            fileName: fileName as string,
            base64: base64 as string
          },
          address: {
            ...formData.address,
            detail: formData.address?.detail || '',
            provinceId: formData.address?.provinceId || '',
            districtId: formData.address?.districtId || '',
            wardId: formData.address?.wardId || '',
            province: province?.province_name || '',
            district: district?.district_name || '',
            ward: ward?.ward_name || '',
            fullAddress
          }
        });
        if (result.code === 'OK') {
          NotifySuccess(result.message);
          setOpened(false);
        } else {
          NotifyError(result.message);
        }
      }
    } catch {
      NotifyError('Xảy ra ngoại lệ khi tạo người dùng.');
    }
  };

  const { data: roles } = api.RolePermission.getAllRole.useQuery();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid>
        <GridCol span={3}>
          <Center>
            <Avatar
              src={
                watch('image.url') instanceof File
                  ? URL.createObjectURL(watch('image.url') as File)
                  : '/images/jpg/empty-300x240.jpg'
              }
              size={200}
              alt='Product Image'
              className='mb-4'
            />
          </Center>
          <Controller
            name='image.url'
            control={control}
            rules={{
              required: 'File hoặc URL là bắt buộc',
              validate: file =>
                file && ['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)
                  ? true
                  : 'Only PNG, JPEG, or JPG files are allowed'
            }}
            render={({ field }) => (
              <FileInput
                leftSection={<ActionIcon size='xs' color='gray' variant='transparent' component={IconFile} />}
                label='Ảnh chính'
                placeholder='Chọn một file'
                leftSectionPointerEvents='none'
                {...field}
                error={errors.image?.message}
                accept='image/png,image/jpeg,image/jpg'
              />
            )}
          />
        </GridCol>
        <GridCol span={9}>
          <Grid gutter='md'>
            <GridCol span={4}>
              <Controller
                control={control}
                name='name'
                render={({ field }) => (
                  <TextInput
                    {...field}
                    required
                    label='Tên'
                    placeholder='Nhập tên người dùng'
                    error={errors.name?.message}
                  />
                )}
              />
            </GridCol>

            <GridCol span={4}>
              <Controller
                control={control}
                name='email'
                render={({ field }) => (
                  <TextInput
                    {...field}
                    type='email'
                    required
                    leftSection={<IconMail size={18} stroke={1.5} />}
                    label='Email'
                    placeholder='Nhập email người dùng'
                    error={errors.email?.message}
                  />
                )}
              />
            </GridCol>

            <GridCol span={4}>
              <Controller
                control={control}
                name='password'
                render={({ field }) => (
                  <PasswordInput
                    label='Mật khẩu'
                    placeholder='Nhập mật khẩu người dùng'
                    error={errors.password?.message}
                    {...field}
                  />
                )}
              />
            </GridCol>

            <GridCol span={4}>
              <Controller
                control={control}
                name='phone'
                render={({ field }) => (
                  <TextInput
                    {...field}
                    label='Số điện thoại'
                    leftSection={<IconPhone size={18} stroke={1.5} />}
                    placeholder='Nhập số điện thoại người dùng'
                    error={errors.phone?.message}
                  />
                )}
              />
            </GridCol>

            <GridCol span={4}>
              <Controller
                control={control}
                name='roleId'
                render={({ field }) => (
                  <Select
                    label='Vai trò'
                    searchable
                    placeholder='Chọn vai trò'
                    {...field}
                    data={roles?.map(role => ({ value: role.id, label: role.name })) || []}
                    error={errors.roleId?.message}
                  />
                )}
              />
            </GridCol>

            <GridCol span={4}>
              <Controller
                control={control}
                name='dateOfBirth'
                render={({ field }) => {
                  const dateValue = field.value ? new Date(field.value) : null;
                  return (
                    <DateTimePicker
                      valueFormat='DD-MM-YYYY'
                      leftSection={<IconCalendar size={18} stroke={1.5} />}
                      dropdownType='modal'
                      label='Năm sinh'
                      placeholder='Chọn năm sinh'
                      {...field}
                      value={dateValue}
                    />
                  );
                }}
              />
            </GridCol>

            <GridCol span={4}>
              <Controller
                control={control}
                name={`address.provinceId`}
                render={({ field }) => (
                  <Select
                    {...field}
                    searchable
                    label='Chọn tỉnh thành'
                    placeholder='Chọn tỉnh thành'
                    data={provinces?.results?.map((item: any) => ({
                      value: item.province_id,
                      label: item.province_name
                    }))}
                    nothingFoundMessage='Nothing found...'
                    error={errors?.address?.province?.message}
                  />
                )}
              />
            </GridCol>
            <GridCol span={4}>
              <Controller
                control={control}
                name={`address.districtId`}
                disabled={!watch('address.provinceId')}
                render={({ field }) => (
                  <Select
                    {...field}
                    searchable
                    label='Chọn quận huyện'
                    placeholder='Chọn quận huyện'
                    data={districts?.results?.map((item: any) => ({
                      value: item.district_id,
                      label: item.district_name
                    }))}
                    nothingFoundMessage='Nothing found...'
                    error={errors?.address?.district?.message}
                  />
                )}
              />
            </GridCol>
            <GridCol span={4}>
              <Controller
                control={control}
                name={`address.wardId`}
                disabled={!watch('address.districtId')}
                render={({ field }) => (
                  <Select
                    {...field}
                    label='Chọn phường xã'
                    searchable
                    placeholder='Chọn phường xã'
                    data={wards?.results?.map((item: any) => ({
                      value: item.ward_id,
                      label: item.ward_name
                    }))}
                    nothingFoundMessage='Nothing found...'
                    error={errors?.address?.ward?.message}
                  />
                )}
              />
            </GridCol>
            <GridCol span={4}>
              <Controller
                control={control}
                name='gender'
                render={({ field }) => (
                  <Select
                    placeholder='Giới tính'
                    searchable
                    label='Giới tính'
                    {...field}
                    data={[
                      { value: LocalGender.MALE, label: 'Nam' },
                      { value: LocalGender.FEMALE, label: 'Nữ' },
                      { value: LocalGender.OTHER, label: 'Khác' }
                    ]}
                  />
                )}
              />
            </GridCol>
            <GridCol span={12}>
              <Controller
                control={control}
                name={`address.detail`}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    label='Địa chỉ chi tiết'
                    placeholder='Địa chỉ cụ thể (đường, phố, quận, huyện,...)'
                    resize='block'
                    error={errors?.address?.detail?.message}
                  />
                )}
              />
            </GridCol>

            <GridCol span={12}>
              <Button type='submit' className='mt-4 w-full' loading={isSubmitting} disabled={!isDirty} fullWidth>
                Tạo mới
              </Button>
            </GridCol>
          </Grid>
        </GridCol>
      </Grid>
    </form>
  );
}
