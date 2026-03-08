'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ActionIcon,
  Avatar,
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
import { AddressType, Gender, UserLevel } from '@prisma/client';
import { IconCalendar, IconFile, IconMail, IconPhone } from '@tabler/icons-react';
import type { Dispatch, SetStateAction } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import BButton from '~/components/Button/Button';
import { useDistricts, useProvinces, useWards } from '~/components/Hooks/use-fetch';
import { fileToBase64 } from '~/lib/FuncHandler/handle-file-base64';
import { NotifyError, NotifySuccess } from '~/lib/FuncHandler/toast';
import { userSchema } from '~/lib/ZodSchema/schema';
import { api } from '~/trpc/react';
import { District, Province, Ward } from '~/types/ResponseFetcher';
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
      gender: Gender.OTHER,
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
        type: AddressType.USER
      },
      roleId: '',
      pointUser: 0,
      level: UserLevel.BRONZE
    }
  });
  const { provinces, getProvince } = useProvinces();
  const [debouncedProvinceId] = useDebouncedValue(watch('address.provinceId'), 300);
  const [debouncedDistrictId] = useDebouncedValue(watch('address.districtId'), 300);
  const { districts, getDistrict } = useDistricts(debouncedProvinceId);
  const { wards, getWard } = useWards(debouncedDistrictId);

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

        const province = getProvince(formData?.address?.provinceId, provinces);
        const district = getDistrict(formData?.address?.districtId, districts);
        const ward = getWard(formData?.address?.wardId, wards);
        const fullAddress = `${formData.address?.detail || ''}, ${ward?.name || ''}, ${district?.name || ''}, ${province?.name || ''}`;

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
            province: province?.name || '',
            district: district?.name || '',
            ward: ward?.name || '',
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
                    radius='md'
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
                    radius='md'
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
                    radius='md'
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
                    radius='md'
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
                    radius='md'
                    label='Chọn tỉnh thành'
                    placeholder='Chọn tỉnh thành'
                    data={provinces.map((item: Province) => ({
                      value: item.code.toString(),
                      label: item.name
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
                    radius='md'
                    label='Chọn quận huyện'
                    placeholder='Chọn quận huyện'
                    data={districts.map((item: District) => ({
                      value: item.code.toString(),
                      label: item.name
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
                    radius='md'
                    placeholder='Chọn phường xã'
                    data={wards.map((item: Ward) => ({
                      value: item.code.toString(),
                      label: item.name
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
                    radius='md'
                    {...field}
                    data={[
                      { value: Gender.MALE, label: 'Nam' },
                      { value: Gender.FEMALE, label: 'Nữ' },
                      { value: Gender.OTHER, label: 'Khác' }
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
              <BButton type='submit' className='mt-4' loading={isSubmitting} disabled={!isDirty} fullWidth>
                Tạo mới
              </BButton>
            </GridCol>
          </Grid>
        </GridCol>
      </Grid>
    </form>
  );
}
