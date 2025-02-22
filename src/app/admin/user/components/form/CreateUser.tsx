'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { ActionIcon, Avatar, Button, FileInput, Grid, PasswordInput, Select, TextInput } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { Gender, UserLevel, UserRole } from '@prisma/client';
import { IconFile } from '@tabler/icons-react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { User } from '~/app/Entity/UserEntity';
import { fileToBase64 } from '~/app/lib/utils/func-handler/handle-file-upload';
import { NotifyError, NotifySuccess } from '~/app/lib/utils/func-handler/toast';
import { userSchema } from '~/app/lib/utils/zod/zodShcemaForm';
import { api } from '~/trpc/react';

export default function CreateUser({ setOpened }: { setOpened: any }) {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
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
      pointLevel: 0,
      level: UserLevel.DONG
    }
  });

  const utils = api.useUtils();
  const mutation = api.User.create.useMutation();

  const onSubmit: SubmitHandler<User> = async formData => {
    try {
      if (formData) {
        const file = formData?.image?.url as File;
        const fileName = file?.name || '';
        const base64 = file ? await fileToBase64(file) : '';
        let result = await mutation.mutateAsync({
          ...formData,
          image: {
            fileName: fileName as string,
            base64: base64 as string
          }
        });
        if (result.success) {
          NotifySuccess(result.message);
          setOpened(false);
          utils.User.invalidate();
        } else {
          NotifyError(result.message);
        }
      }
    } catch (error) {
      NotifyError('Error created User');
    }
  };

  return (
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
            <Grid.Col span={12}>
              <Controller
                control={control}
                name='dateOfBirth'
                render={({ field }) => {
                  const dateValue = field.value ? new Date(field.value) : null;
                  return <DatePickerInput p={0} m={0} placeholder='Chọn năm sinh' {...field} value={dateValue} />;
                }}
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <Controller
                control={control}
                name='gender'
                render={({ field }) => (
                  <Select
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
                  <TextInput
                    type='textarea'
                    label='Địa chỉ'
                    placeholder='Enter your tag'
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
        Tạo mới
      </Button>
    </form>
  );
}
