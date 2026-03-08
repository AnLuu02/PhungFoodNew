'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ActionIcon,
  Alert,
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
  TextInput
} from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { useDebouncedValue } from '@mantine/hooks';
import { Gender, UserLevel } from '@prisma/client';
import { IconCalendar, IconFile, IconInfoCircle, IconMail, IconPhone, IconUpload } from '@tabler/icons-react';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import AddressSection from '~/components/AdressSection';
import BButton from '~/components/Button/Button';
import LoadingSpiner from '~/components/Loading/LoadingSpiner';
import { infoUserLevel, UserRole } from '~/constants';
import { fileToBase64, vercelBlobToFile } from '~/lib/FuncHandler/handle-file-base64';
import { NotifyError, NotifySuccess } from '~/lib/FuncHandler/toast';
import { UserInput, userInputSchema } from '~/shared/user.schema';
import { api } from '~/trpc/react';
import { TRPCErrorCode } from '~/types/ResponseFetcher';

export default function UserUpsert({
  email,
  setOpened,
  method
}: {
  email?: string;
  setOpened: Dispatch<SetStateAction<boolean>>;
  method: 'create' | 'update';
}) {
  const [error, setError] = useState<{ code: TRPCErrorCode | undefined; message: string }>({
    code: undefined,
    message: ''
  });
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
  } = useForm<UserInput>({
    resolver: zodResolver(userInputSchema),
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
      roleId: '',
      address: undefined,
      pointUser: 0
    }
  });

  useEffect(() => {
    setLoading(true);
    if (user && user?.image?.url) {
      vercelBlobToFile(user?.image?.url as string)
        .then(file => {
          setValue('image.url', file as File);
        })
        .catch(err => {
          console.error(err);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
    reset({
      id: user?.id,
      name: user?.name,
      email: user?.email,
      password: user?.password,
      dateOfBirth: user?.dateOfBirth || new Date(),
      gender: user?.gender || Gender.OTHER,
      phone: user?.phone || '',
      roleId: user?.roleId || '',
      address: user?.address as any,
      pointUser: user?.pointUser,
      level: user?.level,
      isActive: user?.isActive
    });
  }, [user, reset]);
  const utils = api.useUtils();
  const updateMutation = api.User?.[method]?.useMutation({
    onSuccess: () => {
      NotifySuccess('Chúc mừng bạn thực hiện thao tác thành công.');
      setOpened(false);
      utils.User.invalidate();
    },
    onError: e => {
      setError({
        code: e.data?.code,
        message: e.message
      });
      NotifyError(e.message);
    }
  });

  const onSubmit: SubmitHandler<UserInput> = async formData => {
    const file = formData?.image?.url as File;
    const fileName = file?.name || '';
    const base64 = file ? await fileToBase64(file) : '';
    const formDataWithImageUrlAsString = {
      ...formData,
      image: {
        fileName: fileName as string,
        base64: base64 as string
      }
    };
    await updateMutation.mutateAsync(formDataWithImageUrlAsString);
  };
  const { data: roles, isLoading: rolesLoading } = api.RolePermission.getAllRole.useQuery();

  const [pointUserValue] = useDebouncedValue(watch('pointUser'), 500);

  useEffect(() => {
    const level = infoUserLevel.find(level => level.minPoint <= pointUserValue && level.maxPoint >= pointUserValue);
    setValue('level', level?.key || UserLevel.BRONZE);
  }, [pointUserValue]);

  if (loading || rolesLoading) return <LoadingSpiner />;
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
                alt='User Image'
                className='mb-4'
              />
              <Box className='z-1 absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100'>
                <ButtonGroup>
                  <Button
                    size='xs'
                    bg={'red'}
                    disabled={!watch('image.url')}
                    onClick={() => {
                      setValue('image.url', undefined, {
                        shouldDirty: true,
                        shouldValidate: true
                      });
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
            {error.code && (
              <GridCol span={12} className='flex justify-center'>
                <Alert
                  w={'100%'}
                  radius={'md'}
                  variant='light'
                  color='yellow'
                  title='Cảnh báo'
                  icon={<IconInfoCircle />}
                >
                  {error.message}
                </Alert>
              </GridCol>
            )}
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
                render={({ field }) => (
                  <Select
                    label='Vai trò'
                    radius='md'
                    searchable
                    disabled={session?.user.role !== UserRole.ADMIN}
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
                name='gender'
                render={({ field }) => (
                  <Select
                    radius='md'
                    placeholder='Giới tính'
                    searchable
                    label='Giới tính'
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
            <AddressSection control={control} setValue={setValue} />
            <GridCol span={4}>
              <Controller
                control={control}
                name={`pointUser`}
                defaultValue={0}
                render={({ field }) => (
                  <NumberInput
                    radius={'md'}
                    {...field}
                    disabled={session?.user.role !== UserRole.ADMIN}
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
                name={`level`}
                render={({ field }) => (
                  <Select
                    radius='md'
                    {...field}
                    disabled={session?.user.role !== UserRole.ADMIN}
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
