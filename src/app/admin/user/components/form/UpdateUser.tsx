'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { ActionIcon, Avatar, Button, FileInput, Grid, PasswordInput, Select, Textarea, TextInput } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { Gender, UserRole } from '@prisma/client';
import { IconFile } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import LoadingComponent from '~/app/_components/Loading';
import { User } from '~/app/Entity/UserEntity';
import { fileToBase64, firebaseToFile } from '~/app/lib/utils/func-handler/handle-file-upload';
import { NotifyError, NotifySuccess } from '~/app/lib/utils/func-handler/toast';
import { userSchema } from '~/app/lib/utils/zod/zodShcemaForm';
import { api } from '~/trpc/react';

export default function UpdateUser({
  email,
  setOpened,
  isClient = false
}: {
  email: string;
  setOpened: any;
  isClient?: boolean;
}) {
  const queryResult = email ? api.User.getOne.useQuery({ query: email || '' }) : { data: null };
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
      gender: Gender.OTHER,
      dateOfBirth: new Date(),
      password: '',
      phone: '',
      role: UserRole.CUSTOMER,
      address: '',
      pointLevel: 0
    }
  });
  useEffect(() => {
    setLoading(true);
    if (data && data?.images?.[0]?.url && data?.images?.[0]?.url !== '') {
      firebaseToFile(data?.images?.[0]?.url as string)
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
      gender: data?.gender || Gender.OTHER,
      role: data?.role,
      phone: data?.phone || '',
      address: data?.address || '',
      pointLevel: data?.pointLevel
    });
  }, [data, reset]);
  const utils = api.useUtils();
  const updateMutation = api.User.update.useMutation();

  const onSubmit: SubmitHandler<User> = async formData => {
    if (email) {
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
      let result = await updateMutation.mutateAsync(formDataWithImageUrlAsString);
      if (result.success) {
        NotifySuccess(result.message);
        setOpened(false);
        utils.User.invalidate();
      } else {
        NotifyError(result.message);
      }
    }
  };

  return loading ? (
    <LoadingComponent />
  ) : (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid>
        <Grid.Col span={5}>
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
          <Grid.Col span={12}>
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
          </Grid.Col>
        </Grid.Col>
        <Grid.Col span={7}>
          <Grid gutter='md'>
            <Grid.Col span={12}>
              <Controller
                control={control}
                name='name'
                render={({ field }) => (
                  <TextInput label='Tên' placeholder='Enter your name' error={errors.name?.message} {...field} />
                )}
              />
            </Grid.Col>

            <Grid.Col span={12}>
              <Controller
                control={control}
                name='email'
                render={({ field }) => (
                  <TextInput label='Email' placeholder='Enter your tag' error={errors.email?.message} {...field} />
                )}
              />
            </Grid.Col>

            {!isClient && (
              <Grid.Col span={12}>
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
              </Grid.Col>
            )}

            <Grid.Col span={6}>
              <Controller
                control={control}
                name='phone'
                render={({ field }) => (
                  <TextInput
                    label='Số điện thoại'
                    placeholder='Enter your name'
                    error={errors.phone?.message}
                    {...field}
                  />
                )}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <Controller
                name='role'
                control={control}
                rules={{ required: 'Role is required' }}
                render={({ field, fieldState }) => (
                  <Select
                    label='Role'
                    placeholder='Select your role'
                    data={[
                      { value: 'CUSTOMER', label: 'CUSTOMER' },
                      { value: 'ADMIN', label: 'ADMIN' },
                      { value: 'STAFF', label: 'STAFF' }
                    ]}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    error={errors.role?.message}
                  />
                )}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <Controller
                control={control}
                name='dateOfBirth'
                render={({ field }) => {
                  const dateValue = field.value ? new Date(field.value) : null;
                  return (
                    <DatePickerInput
                      label='Năm sinh'
                      p={0}
                      m={0}
                      placeholder='Chọn năm sinh'
                      {...field}
                      value={dateValue}
                    />
                  );
                }}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <Controller
                control={control}
                name='gender'
                render={({ field }) => (
                  <Select
                    label='Giới tính'
                    placeholder='Giới tính'
                    {...field}
                    data={[
                      { value: Gender.MALE, label: 'Nam' },
                      { value: Gender.FEMALE, label: 'Nữ' },
                      { value: Gender.OTHER, label: 'Khác' }
                    ]}
                  />
                )}
              />
            </Grid.Col>

            <Grid.Col span={12}>
              <Controller
                control={control}
                name='address'
                render={({ field }) => (
                  <Textarea
                    label='Địa chỉ'
                    placeholder='Nhập địa chỉ cụ thể'
                    error={errors.address?.message}
                    {...field}
                  />
                )}
              />
            </Grid.Col>
          </Grid>
        </Grid.Col>
      </Grid>
      <Button type='submit' className='mt-4 w-full' loading={isSubmitting} fullWidth>
        Cập nhật
      </Button>
    </form>
  );
}
