'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, Center, Grid, GridCol, PasswordInput, Select, Text, TextInput, Title } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { useDebouncedValue, useDisclosure } from '@mantine/hooks';
import { IconCalendar, IconKey, IconMail, IconPhone } from '@tabler/icons-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import BButton from '~/components/Button/Button';
import { useDistricts, useProvinces, useWards } from '~/components/Hooks/use-fetch';
import { NotifyError, NotifySuccess } from '~/lib/FuncHandler/toast';
import { LocalAddressType, LocalGender, LocalUserLevel } from '~/lib/ZodSchema/enum';
import { userSchema } from '~/lib/ZodSchema/schema';
import { api } from '~/trpc/react';
import { User } from '~/types/user';
import AddressSection from '../components/AdressSection';
const OtpModal = dynamic(() => import('~/components/Modals/ModalOtp'), {
  ssr: false
});
export default function Page() {
  const [opened, { open, close }] = useDisclosure();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isDirty }
  } = useForm<User>({
    resolver: zodResolver(userSchema),
    mode: 'onChange',
    defaultValues: {
      id: '',
      name: '',
      email: '',
      image: undefined,
      gender: LocalGender.OTHER,
      dateOfBirth: new Date(),
      isActive: true,
      password: '',
      phone: '',
      address: {
        detail: '',
        provinceId: '',
        districtId: '',
        wardId: '',
        type: LocalAddressType.USER,
        province: '',
        district: '',
        ward: '',
        fullAddress: '',
        postalCode: ''
      },
      pointUser: 0,
      level: LocalUserLevel.BRONZE
    }
  });

  const { data: provinces, provinceMap } = useProvinces();

  const [debouncedProvinceId] = useDebouncedValue(watch('address.provinceId'), 300);
  const [debouncedDistrictId] = useDebouncedValue(watch('address.districtId'), 300);

  const { data: districts, districtMap } = useDistricts(debouncedProvinceId);
  const { data: wards, wardMap } = useWards(debouncedDistrictId);

  const mutation = api.User.create.useMutation({
    onSuccess: resp => {
      if (resp?.code === 'OK') {
        open();
        return;
      }
      NotifyError(resp.message);
    },
    onError: e => {
      NotifyError(e.message);
    }
  });

  const onSubmit: SubmitHandler<User> = async formData => {
    try {
      const province = formData?.address?.provinceId && provinceMap?.[formData?.address?.provinceId];
      const district = formData?.address?.districtId && districtMap?.[formData?.address?.districtId];
      const ward = formData?.address?.wardId && wardMap?.[formData?.address?.wardId];
      const fullAddress = `${formData.address?.detail || ''}, ${ward || ''}, ${district || ''}, ${province || ''}`;

      await mutation.mutateAsync({
        ...formData,
        image: {
          fileName: '',
          base64: ''
        },
        address: {
          ...formData.address,
          provinceId: formData.address?.provinceId || '',
          districtId: formData.address?.districtId || '',
          wardId: formData.address?.wardId || '',
          detail: formData.address?.detail || '',
          province: province || '',
          district: district || '',
          ward: ward || '',
          fullAddress: fullAddress
        }
      });
    } catch {
      NotifyError('Đã xảy ra ngoại lệ. Hãy kiểm tra lại.');
    }
  };
  const updateMutation = api.User.updateAny.useMutation({
    onSuccess: () => {
      NotifySuccess('Xác thực tài khoản thành công!');
      window.location.href = '/dang-nhap';
    },
    onError: e => {
      NotifyError(e.message);
    }
  });
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Center my={'md'}>
          <Card
            className='animate-fadeUp'
            w={{ base: '100%', sm: '50vw', md: '40vw' }}
            h={'max-content'}
            py={'xs'}
            shadow='xl'
            radius={'md'}
          >
            <Card.Section p='md'>
              <Grid w={'100%'}>
                <GridCol span={12} className='flex justify-center'>
                  <Title className='font-quicksand text-black dark:text-dark-text' order={2} size={28}>
                    ĐĂNG KÍ
                  </Title>
                </GridCol>
                <GridCol span={6}>
                  <Controller
                    control={control}
                    name='name'
                    render={({ field }) => (
                      <TextInput
                        radius={'md'}
                        withAsterisk
                        label='Họ tên'
                        placeholder='Họ tên'
                        {...field}
                        error={errors.name?.message}
                      />
                    )}
                  />
                </GridCol>

                <GridCol span={6}>
                  <Controller
                    control={control}
                    name='email'
                    render={({ field }) => (
                      <TextInput
                        radius={'md'}
                        withAsterisk
                        leftSection={<IconMail size={18} stroke={1.5} />}
                        placeholder='E-mail'
                        type='email'
                        label='E-mail'
                        {...field}
                        error={errors.email?.message}
                      />
                    )}
                  />
                </GridCol>
                <GridCol span={6}>
                  <Controller
                    control={control}
                    name='phone'
                    render={({ field }) => (
                      <TextInput
                        radius={'md'}
                        {...field}
                        withAsterisk
                        label='Số điện thoại'
                        leftSection={<IconPhone size={18} stroke={1.5} />}
                        placeholder='Số điện thoại'
                        error={errors.phone?.message}
                      />
                    )}
                  />
                </GridCol>
                <GridCol span={6}>
                  <Controller
                    control={control}
                    name='password'
                    render={({ field }) => (
                      <PasswordInput
                        radius={'md'}
                        label='Mật khẩu'
                        withAsterisk
                        leftSection={<IconKey size={18} stroke={1.5} />}
                        placeholder='Nhập mặt khẩu'
                        {...field}
                        error={errors.password?.message}
                      />
                    )}
                  />
                </GridCol>
                <GridCol span={6}>
                  <Controller
                    control={control}
                    name='dateOfBirth'
                    render={({ field }) => {
                      const dateValue = field.value ? new Date(field.value) : null;
                      return (
                        <DateTimePicker
                          radius={'md'}
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
                <GridCol span={6}>
                  <Controller
                    control={control}
                    name='gender'
                    render={({ field }) => (
                      <Select
                        label='Giới tính'
                        searchable
                        radius={'md'}
                        placeholder='Giới tính'
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
                <AddressSection
                  control={control}
                  errors={errors}
                  watch={watch}
                  provinces={provinces}
                  districts={districts}
                  wards={wards}
                />

                <GridCol span={12} className='flex justify-end'>
                  <Link href={'/dang-nhap'}>
                    <Text
                      fw={700}
                      className='cursor-pointer text-mainColor hover:text-subColor dark:text-dark-text dark:hover:text-mainColor'
                      size='sm'
                    >
                      Bạn đã có tài khoản?
                    </Text>
                  </Link>
                </GridCol>
                <GridCol span={12}>
                  <BButton
                    disabled={!isDirty}
                    loading={isSubmitting}
                    type='submit'
                    fullWidth
                    size='md'
                    children={'ĐĂNG KÍ'}
                  />
                </GridCol>
              </Grid>
            </Card.Section>
          </Card>
        </Center>
      </form>
      <OtpModal
        opened={opened}
        onClose={close}
        email={watch('email')}
        timeExpiredMinutes={3}
        onAfterVerify={async () => {
          await updateMutation.mutateAsync({
            where: {
              email: watch('email')
            },
            data: {
              isVerified: true
            }
          });
        }}
      />
    </>
  );
}
