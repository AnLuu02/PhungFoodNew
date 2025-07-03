'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Card, Center, Grid, GridCol, PasswordInput, rem, Select, Text, TextInput, Title } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { IconCalendar, IconKey, IconMail, IconPhone } from '@tabler/icons-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import useSWR from 'swr';
import { User } from '~/Entity/UserEntity';
import fetcher from '~/lib/func-handler/fetcher';
import { NotifyError, NotifySuccess } from '~/lib/func-handler/toast';
import { LocalAddressType, LocalGender, LocalUserLevel } from '~/lib/zod/EnumType';
import { userSchema } from '~/lib/zod/zodShcemaForm';
import { api } from '~/trpc/react';
const DateTimePicker = dynamic(() => import('@mantine/dates').then(m => m.DateTimePicker), { ssr: false });
const AddressSection = dynamic(() => import('../components/AdressSection'), { ssr: false });

export default function Page() {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
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
      pointLevel: 0,
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

  const mutation = api.User.create.useMutation();

  const onSubmit: SubmitHandler<User> = async formData => {
    try {
      if (formData) {
        const province = provinces?.results?.find((item: any) => item.province_id === formData?.address?.provinceId);
        const district = districts?.results?.find((item: any) => item.district_id === formData?.address?.districtId);
        const ward = wards?.results?.find((item: any) => item.ward_id === formData?.address?.wardId);
        const fullAddress = `${formData.address?.detail || ''}, ${ward?.ward_name || ''}, ${district?.district_name || ''}, ${province?.province_name || ''}`;

        const result = await mutation.mutateAsync({
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
            province: province?.province_name || '',
            district: district?.district_name || '',
            ward: ward?.ward_name || '',
            fullAddress: fullAddress
          }
        });
        if (result.success) {
          NotifySuccess('Thành công!', `${result.message}`);
          router.push('/dang-nhap');
        } else {
          NotifyError('Cảnh báo!', `${result.message}`);
        }
      }
    } catch (error) {
      NotifyError('Đã xảy ra ngoại lệ. Hãy kiểm tra lại.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Center my={'md'}>
        <Card
          w={{ base: '100%', sm: '50vw', md: '40vw', lg: '33vw' }}
          h={'max-content'}
          py={'xs'}
          shadow='xl'
          radius={'md'}
        >
          <Card.Section p='md'>
            <Grid w={'100%'}>
              <GridCol span={12} className='flex justify-center'>
                <Title className='font-quicksand' order={2} size={rem(28)} c={'black'}>
                  ĐĂNG KÍ
                </Title>
              </GridCol>
              <GridCol span={6}>
                <Controller
                  control={control}
                  name='name'
                  render={({ field }) => (
                    <TextInput label='Họ tên' placeholder='Họ tên' {...field} error={errors.name?.message} />
                  )}
                />
              </GridCol>

              <GridCol span={6}>
                <Controller
                  control={control}
                  name='email'
                  render={({ field }) => (
                    <TextInput
                      leftSection={<IconMail size={18} stroke={1.5} />}
                      placeholder='E-mail, số điện thoại'
                      type='email'
                      label='E-mail, số điện thoại'
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
                      label='Số điện thoại'
                      leftSection={<IconPhone size={18} stroke={1.5} />}
                      placeholder='Số điện thoại'
                      {...field}
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
                      label='Mật khẩu'
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
                <Link href={'/dang-nhap'} className='text-white'>
                  <Text size='sm' className='cursor-pointer text-black underline hover:text-red-500'>
                    Bạn đã có tài khoản?
                  </Text>
                </Link>
              </GridCol>
              <GridCol span={12}>
                <Button
                  fullWidth
                  size='md'
                  className='bg-[#008b4b] text-white transition-all duration-200 ease-in-out hover:bg-[#f8c144] hover:text-black'
                  type='submit'
                  loading={isSubmitting}
                >
                  ĐĂNG KÍ
                </Button>
              </GridCol>
            </Grid>
          </Card.Section>
        </Card>
      </Center>
    </form>
  );
}
