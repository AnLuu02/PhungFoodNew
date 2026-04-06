'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Grid, GridCol, NumberInput, PasswordInput, Select, Switch, Text, TextInput } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { useDebouncedValue } from '@mantine/hooks';
import { EntityType, Gender, ImageType, UserLevel } from '@prisma/client';
import { IconCalendar, IconInfoCircle, IconMail, IconPhone } from '@tabler/icons-react';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Controller, FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import AddressSection from '~/components/AdressSection';
import BButton from '~/components/Button/Button';
import ThumbnailUpsert from '~/components/ImageFormUpsert';
import { ModalUpsertSkeleton } from '~/components/ModelUpsertSkeleton';
import { infoUserLevel } from '~/constants';
import { handleUploadFromClient } from '~/lib/Cloudinary/client';
import { NotifyError, NotifySuccess } from '~/lib/FuncHandler/toast';
import { UserRole } from '~/shared/constants/user';
import { StatusImage } from '~/shared/schema/image.schema';
import { UserInput, userInputSchema } from '~/shared/schema/user.schema';
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
  const pathname = usePathname();
  const formFields = useForm<UserInput>({
    resolver: zodResolver(userInputSchema),
    defaultValues: {
      id: '',
      name: '',
      email: '',
      image: {
        url: undefined,
        urlFile: undefined,
        publicId: undefined
      },
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
    if (user?.id) {
      formFields.reset({
        id: user?.id,
        name: user?.name,
        email: user?.email,
        password: user?.password,
        dateOfBirth: user?.dateOfBirth || new Date(),
        gender: user?.gender || Gender.OTHER,
        phone: user?.phone || '',
        image: user?.image
          ? ({
              ...user?.image,
              publicId: user?.image?.publicId || '',
              altText: user?.image?.altText || 'Ảnh đại diện của ' + user?.name,
              type: user?.image?.type || ImageType.LOGO,
              entityType: user?.image?.entityType || EntityType.USER
            } as any)
          : undefined,
        roleId: user?.roleId || '',
        address: user?.address as any,
        pointUser: user?.pointUser,
        level: user?.level,
        isActive: user?.isActive
      });
    }
  }, [user, formFields.reset]);
  const utils = api.useUtils();
  const upsertMutation = api.User.upsert.useMutation({
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
    const imageFile = formFields.getValues('image.urlFile');
    const imagePublicId = formFields.getValues('image.publicId');
    const imageToSave = await handleUploadFromClient(imageFile, utils, {
      folder: EntityType.RESTAURANT + '/' + ImageType.LOGO
    });
    await upsertMutation.mutateAsync({
      ...formData,
      image: imageToSave
        ? {
            ...imageToSave,
            type: ImageType.LOGO,
            altText: 'Logo nhà hàng',
            status: StatusImage.NEW
          }
        : user?.image?.publicId && !imagePublicId
          ? {
              publicId: user?.image?.publicId,
              status: StatusImage.DELETED
            }
          : undefined
    });
  };
  const { data: roles, isLoading: rolesLoading } = api.RolePermission.getAllRole.useQuery();

  const [pointUserValue] = useDebouncedValue(formFields.watch('pointUser'), 500);

  useEffect(() => {
    const level = infoUserLevel.find(level => level.minPoint <= pointUserValue && level.maxPoint >= pointUserValue);
    formFields.setValue('level', level?.key || UserLevel.BRONZE);
  }, [pointUserValue]);

  if (rolesLoading) return <ModalUpsertSkeleton />;
  return (
    <FormProvider {...formFields}>
      <form onSubmit={formFields.handleSubmit(onSubmit)}>
        <Grid>
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
                  control={formFields.control}
                  name='name'
                  render={({ field, formState: { errors } }) => (
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
                  control={formFields.control}
                  name='email'
                  render={({ field, formState: { errors } }) => (
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
                  control={formFields.control}
                  name='phone'
                  render={({ field, formState: { errors } }) => (
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
                  control={formFields.control}
                  name='roleId'
                  render={({ field, formState: { errors } }) => (
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
                  control={formFields.control}
                  name='dateOfBirth'
                  render={({ field, formState: { errors } }) => {
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
                  control={formFields.control}
                  name='gender'
                  render={({ field, formState: { errors } }) => (
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
              <GridCol span={12}>
                <AddressSection control={formFields.control} setValue={formFields.setValue} cols={3} />
              </GridCol>
              <GridCol span={4}>
                <Controller
                  control={formFields.control}
                  name={`pointUser`}
                  defaultValue={0}
                  render={({ field, formState: { errors } }) => (
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
                  control={formFields.control}
                  name={`level`}
                  render={({ field, formState: { errors } }) => (
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
                      control={formFields.control}
                      name='password'
                      render={({ field, formState: { errors } }) => (
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
                      control={formFields.control}
                      name={`isActive`}
                      render={({ field, formState: { errors } }) => (
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
                <BButton
                  w-full
                  type='submit'
                  className='mt-4'
                  loading={formFields.formState.isSubmitting}
                  disabled={!formFields.formState.isDirty}
                  fullWidth
                >
                  Tạo mới / Cập nhật
                </BButton>
              </GridCol>
            </Grid>
          </GridCol>
          <GridCol span={3}>
            <Text size='sm' fw={500} mb={4}>
              Ảnh đại diện
            </Text>
            <ThumbnailUpsert nameField={'image'} size={'100%'} />
          </GridCol>
        </Grid>
      </form>
    </FormProvider>
  );
}
