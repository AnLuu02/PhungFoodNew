'use client';
import { Box, Flex, Paper, Radio, Skeleton, Stack, Text, Title } from '@mantine/core';
import { IconTruck } from '@tabler/icons-react';
import { useState } from 'react';
import { Controller } from 'react-hook-form';
import { api } from '~/trpc/react';

const PaymentForm = ({ control }: any) => {
  const { data: paymentData, isLoading } = api.Payment.getAll.useQuery();
  const payment = paymentData ?? [];
  const [paymentMethod, setPaymentMethod] = useState('cod');

  const paymentOptions = [
    {
      id: 'cod',
      label: 'Thanh toán khi nhận hàng (COD)',
      icon: <IconTruck size={24} color='#4C6EF5' />
    },
    {
      id: 'momo',
      label: 'Thanh toán qua Ví Momo',
      icon: (
        <Box
          component='img'
          src='/images/png/momo.png'
          alt='Momo'
          width={24}
          height={24}
          style={{ objectFit: 'contain' }}
        />
      )
    },
    {
      id: 'vnpay',
      label: 'Thanh toán ví điện tử VNPAY',
      icon: (
        <Box
          component='img'
          src='/images/png/vnpay.png'
          alt='VNPAY'
          width={60}
          height={24}
          style={{ objectFit: 'contain' }}
        />
      )
    },
    {
      id: 'paypal',
      label: 'Thanh toán qua Paypal',
      icon: (
        <Box
          component='img'
          src='/images/png/paypal.png'
          alt='Paypal'
          width={24}
          height={24}
          style={{ objectFit: 'contain' }}
        />
      )
    }
  ];
  return (
    // <Card shadow='sm' padding='lg' radius='md' withBorder>
    //   <Title order={3} className='mb-4 font-quicksand'>
    //     Hình thức thanh toán
    //   </Title>
    //   <ScrollAreaAutosize mah={480} px='0' scrollbarSize={5}>
    //     <Paper withBorder p='md' radius='md'>
    //       <Text size='md' fw={700}>
    //         Vui lòng chọn hình thức thanh toán:
    //       </Text>
    //       {isLoading ? (
    //         <Stack mt={5} gap={5}>
    //           <Skeleton height={20} radius='sm' />
    //           <Skeleton height={20} radius='sm' />
    //           <Skeleton height={20} radius='sm' />
    //         </Stack>
    //       ) : (
    //         <Controller
    //           control={control}
    //           name='paymentId'
    //           render={({ field, fieldState }) => (
    //             <Radio.Group
    //               mt='sm'
    //               value={field.value}
    //               onChange={value => {
    //                 field.onChange(value);
    //               }}
    //               name='paymentId'
    //               className='mb-4'
    //             >
    //               <Group mt='sm'>
    //                 {payment?.map(
    //                   (item: any, index: number) =>
    //                     item.type === LocalPaymentType.E_WALLET && (
    //                       <Radio key={index} value={item.id} label={item.name} error={fieldState.error?.message} />
    //                     )
    //                 )}
    //               </Group>
    //             </Radio.Group>
    //           )}
    //         />
    //       )}
    //     </Paper>
    //   </ScrollAreaAutosize>
    // </Card>
    <Paper withBorder p='md' radius='md' mb='md'>
      <Box mb='md'>
        <Title order={5} mb='md' fw={700} className='font-quicksand'>
          PHƯƠNG THỨC THANH TOÁN
        </Title>

        <Stack>
          {isLoading ? (
            <Stack mt={5} gap={5}>
              <Skeleton height={20} radius='sm' />
              <Skeleton height={20} radius='sm' />
              <Skeleton height={20} radius='sm' />
            </Stack>
          ) : (
            <Controller
              control={control}
              name='paymentId'
              render={({ field, fieldState }) => (
                <Radio.Group
                  mt='sm'
                  value={field.value}
                  onChange={value => {
                    field.onChange(value);
                  }}
                  name='paymentId'
                  className='mb-4'
                >
                  <Paper withBorder p='md' radius='md'>
                    {payment?.map((item: any, index: number) => (
                      <Radio
                        label={
                          <Flex align='center' gap='md'>
                            <Flex w={40} justify='center'>
                              <Box
                                component='img'
                                src='/images/png/vnpay.png'
                                alt='VNPAY'
                                width={60}
                                height={24}
                                style={{ objectFit: 'contain' }}
                              />
                            </Flex>
                            <Text size='sm' fw={500}>
                              Thanh toán VNPAY
                            </Text>
                          </Flex>
                        }
                        color='blue'
                        size='sm'
                        key={index}
                        value={item.id}
                        error={fieldState.error?.message}
                      />
                    ))}
                  </Paper>
                </Radio.Group>
              )}
            />
          )}
          {paymentOptions.map(option => (
            <Paper
              key={option.id}
              withBorder
              p='md'
              radius='md'
              style={{
                cursor: 'pointer',
                borderColor: paymentMethod === option.id ? '#4C6EF5' : '#e9ecef'
              }}
              onClick={() => setPaymentMethod(option.id)}
            >
              <Flex align='center' gap='md'>
                <Radio
                  checked={paymentMethod === option.id}
                  onChange={() => setPaymentMethod(option.id)}
                  color='blue'
                  size='sm'
                />
                <Flex w={40} justify='center'>
                  {option.icon}
                </Flex>
                <Text size='sm' fw={500}>
                  {option.label}
                </Text>
              </Flex>
            </Paper>
          ))}
        </Stack>
      </Box>

      <Text size='sm' c='dimmed' mt='lg'>
        Nếu bạn không hài lòng với sản phẩm của chúng tôi? Bạn hoàn toàn có thể trả lại sản phẩm{' '}
        <Text component='a' href='#' c='blue' style={{ textDecoration: 'none' }}>
          Tại đây
        </Text>
      </Text>
    </Paper>
  );
};
export default PaymentForm;
