'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Card,
  Grid,
  GridCol,
  Group,
  NumberInput,
  Select,
  Stack,
  Textarea,
  TextInput,
  Title
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { OrderStatus } from '@prisma/client';
import { IconMail, IconPhone } from '@tabler/icons-react';
import { Controller, SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import useSWR from 'swr';
import fetcher from '~/lib/func-handler/fetcher';
import { NotifyError, NotifySuccess } from '~/lib/func-handler/toast';
import { LocalAddressType, LocalOrderStatus } from '~/lib/zod/EnumType';
import { orderSchema } from '~/lib/zod/zodShcemaForm';
import { api } from '~/trpc/react';
import { Order } from '~/types/order';
import OrderItemForm from './OrderItemForm';

export default function CreateOrder({ setOpened }: { setOpened: any }) {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors, isSubmitting }
  } = useForm<Order>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      id: '',
      total: 0,
      status: LocalOrderStatus.PROCESSING,
      userId: '',
      paymentId: '',
      orderItems: [],
      delivery: {
        address: {
          provinceId: '',
          districtId: '',
          wardId: '',
          detail: '',
          postalCode: '',
          fullAddress: '',
          type: LocalAddressType.DELIVERY,
          province: '',
          district: '',
          ward: ''
        },
        name: '',
        phone: '',
        email: '',
        note: ''
      }
    }
  });

  const {
    fields: orderItemFields,
    append: appendOrderItem,
    remove: removeOrderItem
  } = useFieldArray({
    control,
    name: 'orderItems'
  });
  const { data: provinces } = useSWR<any>('https://api.vnappmob.com/api/v2/province/', fetcher);
  const [debouncedProvinceId] = useDebouncedValue(watch('delivery.address.provinceId'), 300);
  const [debouncedDistrictId] = useDebouncedValue(watch('delivery.address.districtId'), 300);

  const { data: districts } = useSWR<any>(
    debouncedProvinceId ? `https://api.vnappmob.com/api/v2/province/district/${debouncedProvinceId}` : null,
    fetcher
  );

  const { data: wards } = useSWR<any>(
    debouncedDistrictId ? `https://api.vnappmob.com/api/v2/province/ward/${debouncedDistrictId}` : null,
    fetcher
  );
  const { data: payments } = api.Payment.getAll.useQuery();
  const { data: users } = api.User.getAll.useQuery();
  const utils = api.useUtils();
  const mutation = api.Order.create.useMutation({
    onSuccess: () => {
      utils.Order.invalidate();
    }
  });

  const onSubmit: SubmitHandler<Order> = async formData => {
    try {
      if (formData) {
        if (formData.orderItems.length === 0) {
          NotifyError('Không hợp lệ.', 'Bạn phải có ít nhất một sản phẩm trong hóa đơn.');
        } else {
          const province = provinces?.results?.find(
            (item: any) => item.province_id === formData?.delivery?.address?.provinceId
          );
          const district = districts?.results?.find(
            (item: any) => item.district_id === formData?.delivery?.address?.districtId
          );
          const ward = wards?.results?.find((item: any) => item.ward_id === formData?.delivery?.address?.wardId);
          const fullAddress = `${formData?.delivery?.address?.detail || ''}, ${ward?.ward_name || ''}, ${district?.district_name || ''}, ${province?.province_name || ''}`;

          let result = await mutation.mutateAsync({
            ...formData,
            delivery: {
              ...formData?.delivery,
              address: {
                ...formData?.delivery.address,
                detail: formData?.delivery.address?.detail || '',
                provinceId: formData?.delivery.address?.provinceId || '',
                districtId: formData?.delivery.address?.districtId || '',
                wardId: formData?.delivery.address?.wardId || '',
                province: province?.province_name || '',
                district: district?.district_name || '',
                ward: ward?.ward_name || '',
                fullAddress
              }
            }
          });
          if (result.success) {
            NotifySuccess(result.message);
            setOpened(false);
          } else {
            NotifyError(result.message);
          }
        }
      }
    } catch (error) {
      NotifyError('Đã xảy ra ngoại lệ. Hãy kiểm tra lại.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid>
        <GridCol span={6}>
          <Card shadow='sm' padding='lg' radius='md' withBorder>
            <Title order={2} className='mb-4 font-quicksand text-xl'>
              Thông tin vận chuyển
            </Title>
            <Stack gap='md'>
              <Group grow>
                <Controller
                  name='delivery.email'
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextInput
                      label='Email'
                      placeholder='Email'
                      type='email'
                      leftSection={<IconMail size={18} stroke={1.5} />}
                      {...field}
                      error={fieldState.error?.message}
                    />
                  )}
                />
                <Controller
                  name='delivery.name'
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextInput label='Họ và tên' placeholder='Họ và tên' {...field} error={fieldState.error?.message} />
                  )}
                />
              </Group>

              <Group grow>
                <Controller
                  name='delivery.phone'
                  control={control}
                  defaultValue=''
                  render={({ field, fieldState }) => (
                    <TextInput
                      {...field}
                      label='Số điện thoại'
                      leftSection={<IconPhone size={18} stroke={1.5} />}
                      placeholder='Số điện thoại (tùy chọn)'
                      error={fieldState.error?.message}
                    />
                  )}
                />
              </Group>

              <Grid>
                <GridCol span={4}>
                  <Controller
                    control={control}
                    name={`delivery.address.provinceId`}
                    render={({ field, fieldState }) => (
                      <Select
                        {...field}
                        searchable
                        placeholder='Chọn tỉnh thành'
                        data={provinces?.results?.map((item: any) => ({
                          value: item.province_id,
                          label: item.province_name
                        }))}
                        nothingFoundMessage='Nothing found...'
                        error={fieldState.error?.message}
                      />
                    )}
                  />
                </GridCol>
                <GridCol span={4}>
                  <Controller
                    control={control}
                    name={`delivery.address.districtId`}
                    disabled={!watch('delivery.address.provinceId')}
                    render={({ field }) => (
                      <Select
                        {...field}
                        searchable
                        placeholder='Chọn quận huyện'
                        data={districts?.results?.map((item: any) => ({
                          value: item.district_id,
                          label: item.district_name
                        }))}
                        nothingFoundMessage='Nothing found...'
                        error={errors?.delivery?.address?.districtId?.message}
                      />
                    )}
                  />
                </GridCol>
                <GridCol span={4}>
                  <Controller
                    control={control}
                    name={`delivery.address.wardId`}
                    disabled={!watch('delivery.address.districtId')}
                    render={({ field }) => (
                      <Select
                        {...field}
                        searchable
                        placeholder='Chọn phường xã'
                        data={wards?.results?.map((item: any) => ({
                          value: item.ward_id,
                          label: item.ward_name
                        }))}
                        nothingFoundMessage='Nothing found...'
                        error={errors?.delivery?.address?.wardId?.message}
                      />
                    )}
                  />
                </GridCol>
                <GridCol span={12}>
                  <Controller
                    control={control}
                    name={`delivery.address.detail`}
                    render={({ field }) => (
                      <Textarea
                        {...field}
                        label='Địa chỉ'
                        placeholder='Địa chỉ cụ thể (đường, phố, quận, huyện,...)'
                        resize='block'
                        error={errors?.delivery?.address?.detail?.message}
                      />
                    )}
                  />
                </GridCol>
              </Grid>

              <Controller
                name='delivery.note'
                control={control}
                defaultValue=''
                render={({ field }) => (
                  <Textarea resize='block' label='Ghi chú' placeholder='Ghi chú (tùy chọn)' {...field} />
                )}
              />
            </Stack>
          </Card>
        </GridCol>
        <GridCol span={6}>
          <Grid gutter='md'>
            <Grid.Col span={6}>
              <Controller
                name='userId'
                control={control}
                rules={{ required: 'User is required' }}
                render={({ field }) => (
                  <Select
                    label='Khách hàng'
                    searchable
                    placeholder='Select your User'
                    data={users?.map(user => ({ value: user.id, label: user.name }))}
                    {...field}
                    error={errors.userId?.message}
                  />
                )}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <Controller
                name='paymentId'
                control={control}
                rules={{ required: 'Payment is required' }}
                render={({ field }) => (
                  <Select
                    {...field}
                    label='Phương thức thanh toán'
                    searchable
                    placeholder='Select your Payment'
                    data={payments?.map(payment => ({ value: payment.id, label: payment.name }))}
                    error={errors.paymentId?.message}
                  />
                )}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <Controller
                control={control}
                name='total'
                render={({ field: { onChange, onBlur, value, name } }) => (
                  <NumberInput
                    thousandSeparator=','
                    hideControls
                    clampBehavior='strict'
                    readOnly
                    label='Tổng tiền (chỉ đọc)'
                    placeholder='Sẽ được tính ngay sau khi gọi món.'
                    error={errors.total?.message}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    name={name}
                  />
                )}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <Controller
                name='status'
                control={control}
                rules={{ required: 'Status is required' }}
                render={({ field }) => (
                  <Select
                    label='Trạng thái (chỉ đọc)'
                    placeholder='Select your Status'
                    data={Object.values(OrderStatus)}
                    {...field}
                    error={errors.status?.message}
                    readOnly
                  />
                )}
              />
            </Grid.Col>

            <Title order={3} mt='lg'>
              Món ăn
            </Title>
            {orderItemFields.map((field, index) => (
              <OrderItemForm
                key={field.id}
                {...field}
                index={index}
                removeOrderItem={removeOrderItem}
                control={control}
                watch={watch}
                setValue={setValue}
                getValues={getValues}
                errors={errors}
              />
            ))}
            <Button
              type='button'
              onClick={() =>
                appendOrderItem({
                  id: '',
                  productId: '',
                  quantity: 1,
                  price: 0,
                  orderId: ''
                })
              }
              variant='outline'
              w={'100%'}
              m={10}
            >
              Thêm món
            </Button>
          </Grid>
        </GridCol>
      </Grid>
      <Button type='submit' className='mt-4 w-full' loading={isSubmitting} fullWidth>
        Tạo mới
      </Button>
    </form>
  );
}
