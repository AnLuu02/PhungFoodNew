'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ActionIcon,
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Center,
  FileInput,
  Grid,
  GridCol,
  NumberInput,
  PasswordInput,
  Select,
  Switch,
  Textarea,
  TextInput
} from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { useDebouncedValue } from '@mantine/hooks';
import { IconCalendar, IconFile, IconMail, IconPhone, IconUpload } from '@tabler/icons-react';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import useSWR from 'swr';
import { z } from 'zod';
import BButton from '~/components/Button/Button';
import LoadingSpiner from '~/components/Loading/LoadingSpiner';
import { infoUserLevel, UserRole } from '~/constants';
import fetcher from '~/lib/FuncHandler/fetcher';
import { fileToBase64, vercelBlobToFile } from '~/lib/FuncHandler/handle-file-base64';
import { NotifyError, NotifySuccess } from '~/lib/FuncHandler/toast';
import { LocalGender, LocalUserLevel } from '~/lib/ZodSchema/enum';
import { userSchema } from '~/lib/ZodSchema/schema';
import { api } from '~/trpc/react';
import { User } from '~/types/user';

export default function UpdateUser({
  email,
  setOpened
}: {
  email: string;
  setOpened: Dispatch<SetStateAction<boolean>>;
}) {
  const { data: session } = useSession();
  const { data: user } = api.User.getOne.useQuery({ s: email || '' }, { enabled: !!email });
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isDirty },
    reset,
    setValue
  } = useForm<User>({
    resolver: zodResolver(
      userSchema.extend({
        phone: z.string().optional().nullable()
      })
    ),
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
      roleId: '',
      address: undefined,
      pointUser: 0
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
    if (user && user?.image?.url && user?.image?.url !== '') {
      vercelBlobToFile(user?.image?.url as string)
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
      id: user?.id,
      name: user?.name,
      email: user?.email,
      password: user?.password,
      dateOfBirth: user?.dateOfBirth || new Date(),
      gender: user?.gender || LocalGender.OTHER,
      phone: user?.phone || '',
      roleId: user?.roleId || '',
      address: user?.address as any,
      pointUser: user?.pointUser,
      level: user?.level,
      isActive: user?.isActive
    });
  }, [user, reset]);
  const utils = api.useUtils();
  const updateMutation = api.User.update.useMutation({
    onSuccess: result => {
      if (result.code === 'OK') {
        NotifySuccess(result.message);
        setOpened(false);
        utils.User.invalidate();
      } else {
        NotifyError(result.message);
      }
    },
    onError: e => {
      NotifyError(e?.message || 'Lỗi hệ thống');
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
      await updateMutation.mutateAsync(formDataWithImageUrlAsString);
    }
  };

  const { data: roles, isLoading: rolesLoading } = api.RolePermission.getAllRole.useQuery();

  const [pointUserValue] = useDebouncedValue(watch('pointUser'), 500);

  useEffect(() => {
    const level = infoUserLevel.find(level => level.minPoint <= pointUserValue && level.maxPoint >= pointUserValue);
    setValue('level', level?.key || LocalUserLevel.BRONZE);
  }, [pointUserValue]);

  if (loading || isLoading || rolesLoading) return <LoadingSpiner />;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid>
        <GridCol span={3}>
          <Center>
            <Box
              w={200}
              h={200}
              className='group overflow-hidden rounded-full transition-all duration-300'
              pos={'relative'}
            >
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
              <Box className='z-1 absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100'>
                <ButtonGroup>
                  <Button
                    size='xs'
                    bg={'red'}
                    disabled={!watch('image.url')}
                    onClick={() => {
                      setValue('image.url', undefined);
                    }}
                  >
                    Gỡ
                  </Button>
                  <Button size='xs'>
                    <label className='cursor-pointer' htmlFor='image'>
                      {!watch('image.url') ? <IconUpload /> : 'Thay đổi'}
                    </label>
                  </Button>
                </ButtonGroup>
              </Box>
            </Box>
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
                id='image'
                leftSection={<ActionIcon size='xs' color='gray' variant='transparent' component={IconFile} />}
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
                    radius='md'
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
                    radius='md'
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
                name='phone'
                render={({ field }) => (
                  <TextInput
                    radius='md'
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
                disabled={session?.user.role !== UserRole.ADMIN}
                render={({ field }) => (
                  <Select
                    label='Vai trò'
                    radius='md'
                    searchable
                    placeholder='Chọn vai trò'
                    {...field}
                    data={
                      roles?.map(role => ({
                        value: role.id,
                        label: role.viName || 'Khách hàng',
                        disabled: role.name === 'ADMIN'
                      })) || []
                    }
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
                    radius='md'
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
                    radius='md'
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
                    radius='md'
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
            <GridCol span={4}>
              <Controller
                control={control}
                name={`pointUser`}
                defaultValue={0}
                disabled={session?.user.role !== UserRole.ADMIN}
                render={({ field }) => (
                  <NumberInput
                    radius={'md'}
                    {...field}
                    defaultValue={0}
                    min={0}
                    label='Điểm tích lũy'
                    placeholder='Nhập điểm tích lũy'
                    error={errors?.pointUser?.message}
                  />
                )}
              />
            </GridCol>
            <GridCol span={4}>
              <Controller
                control={control}
                disabled={session?.user.role !== UserRole.ADMIN}
                name={`level`}
                render={({ field }) => (
                  <Select
                    radius='md'
                    {...field}
                    data={
                      infoUserLevel.map(level => ({ value: level.key, label: level.viName })) || [
                        { value: 0, label: 'Không cấp độ' }
                      ]
                    }
                    label='Cấp độ'
                    placeholder='Chọn cấp độ'
                    error={errors?.pointUser?.message}
                  />
                )}
              />
            </GridCol>
            {pathname.includes('/admin/user') && (
              <>
                <GridCol span={4}>
                  <Controller
                    control={control}
                    name='password'
                    render={({ field }) => (
                      <PasswordInput
                        label='Mật khẩu'
                        withAsterisk
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
                    name={`isActive`}
                    disabled={session?.user.role !== UserRole.ADMIN}
                    render={({ field }) => (
                      <Switch
                        name={field.name}
                        checked={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        disabled={session?.user.role !== UserRole.ADMIN}
                        label='Trạng thái'
                        error={errors?.isActive?.message}
                      />
                    )}
                  />
                </GridCol>
              </>
            )}

            <GridCol span={12}>
              <Controller
                control={control}
                name={`address.detail`}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    label='Địa chỉ chi tiết'
                    placeholder='Địa chỉ cụ thể (đường, phố,...)'
                    resize='block'
                    error={errors?.address?.detail?.message}
                  />
                )}
              />
            </GridCol>

            <GridCol span={12}>
              <BButton w-full type='submit' className='mt-4' loading={isSubmitting} disabled={!isDirty} fullWidth>
                Cập nhật
              </BButton>
            </GridCol>
          </Grid>
        </GridCol>
      </Grid>
    </form>
  );
}
