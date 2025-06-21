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
import { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import useSWR from 'swr';
import LoadingComponent from '~/app/_components/Loading/Loading';
import { User } from '~/app/Entity/UserEntity';
import fetcher from '~/app/lib/utils/func-handler/fetcher';
import { fileToBase64, vercelBlobToFile } from '~/app/lib/utils/func-handler/handle-file-upload';
import { NotifyError, NotifySuccess } from '~/app/lib/utils/func-handler/toast';
import { LocalAddressType, LocalGender } from '~/app/lib/utils/zod/EnumType';
import { userSchema } from '~/app/lib/utils/zod/zodShcemaForm';
import { api } from '~/trpc/react';

export default function UpdateUser({ email, setOpened }: { email: string; setOpened: any }) {
  const queryResult = email ? api.User.getOne.useQuery({ s: email || '' }) : { data: null };
  const { data } = queryResult;
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
    setValue
  } = useForm<User>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      id: '',
      name: '',
      email: '',
      image: undefined,
      gender: LocalGender.OTHER,
      dateOfBirth: new Date('2000-01-01'),
      password: '',
      phone: '',
      roleId: '',
      address: { detail: '', type: LocalAddressType.USER },
      pointLevel: 0
    }
  });
  const { data: provinces } = useSWR<any>('https://api.vnappmob.com/api/v2/province/', fetcher);
  const [debouncedProvinceId] = useDebouncedValue(watch('address.provinceId'), 300);
  const [debouncedDistrictId] = useDebouncedValue(watch('address.districtId'), 300);

  const { data: districts } = useSWR<any>(
    debouncedProvinceId ? `https://api.vnappmob.com/api/v2/province/district/${debouncedProvinceId}` : null,
    fetcher
  );

  const { data: wards, isLoading } = useSWR<any>(
    debouncedDistrictId ? `https://api.vnappmob.com/api/v2/province/ward/${debouncedDistrictId}` : null,
    fetcher
  );
  useEffect(() => {
    setLoading(true);
    if (data && data?.image?.url && data?.image?.url !== '') {
      vercelBlobToFile(data?.image?.url as string)
        .then(file => {
          setValue('image.url', file as File);
        })
        .catch(err => {
          new Error(err);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
    reset({
      id: data?.id,
      name: data?.name,
      email: data?.email,
      password: data?.password,
      dateOfBirth: data?.dateOfBirth || new Date(),
      gender: data?.gender || LocalGender.OTHER,
      phone: data?.phone || '',
      roleId: data?.roleId || '',
      address: data?.address as any,
      pointLevel: data?.pointLevel
    });
  }, [data, reset]);
  const utils = api.useUtils();
  const updateMutation = api.User.update.useMutation({
    onSuccess: () => {
      utils.User.getAll.invalidate();
    }
  });

  const onSubmit: SubmitHandler<User> = async formData => {
    if (email) {
      const file = formData?.image?.url as File;
      const fileName = file?.name || '';
      const base64 = file ? await fileToBase64(file) : '';

      const province = provinces?.results?.find((item: any) => item.province_id === formData?.address?.provinceId);
      const district = districts?.results?.find((item: any) => item.district_id === formData?.address?.districtId);
      const ward = wards?.results?.find((item: any) => item.ward_id === formData?.address?.wardId);
      const fullAddress = `${formData.address?.detail || ''}, ${ward?.ward_name || ''}, ${district?.district_name || ''}, ${province?.province_name || ''}`;

      const formDataWithImageUrlAsString = {
        ...formData,
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
        },
        image: {
          fileName: fileName as string,
          base64: base64 as string
        }
      };

      let result = await updateMutation.mutateAsync(formDataWithImageUrlAsString);
      if (result.success) {
        NotifySuccess(result.message);
        setOpened(false);
      } else {
        NotifyError(result.message);
      }
    }
  };

  const { data: roles, isLoading: rolesLoading } = api.RolePermission.getAllRole.useQuery();

  return loading || isLoading ? (
    <LoadingComponent />
  ) : (
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
              required: 'File or URL is required',
              validate: file =>
                file && ['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)
                  ? true
                  : 'Only PNG, JPEG, or JPG files are allowed'
            }}
            render={({ field, fieldState }) => (
              <FileInput
                leftSection={<ActionIcon size='sx' color='gray' variant='transparent' component={IconFile} />}
                label='Ảnh chính'
                placeholder='Choose a file'
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
                    placeholder='Enter your name'
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
                    placeholder='Enter your tag'
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
                    placeholder='Enter your name'
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
                    placeholder='Enter your name'
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
              <Button type='submit' className='mt-4 w-full' loading={isSubmitting} fullWidth>
                Cập nhật
              </Button>
            </GridCol>
          </Grid>
        </GridCol>
      </Grid>
    </form>
  );
}
