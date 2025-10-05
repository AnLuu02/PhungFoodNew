import { Box, Flex, Paper, Radio, Skeleton, Stack, Text, Title } from '@mantine/core';
import { Controller } from 'react-hook-form';
import { api } from '~/trpc/react';

export const PaymentForm = ({ control }: any) => {
  const { data: paymentData, isLoading } = api.Payment.getAll.useQuery();
  const payment = paymentData?.data ?? [];
  return (
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
                  error={fieldState.error?.message}
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
                        error={fieldState.error ? true : false}
                        color='blue'
                        size='sm'
                        key={index}
                        value={item.id}
                      />
                    ))}
                  </Paper>
                </Radio.Group>
              )}
            />
          )}
        </Stack>
      </Box>

      <Text size='sm' c='dimmed' mt='lg'>
        Nếu bạn không hài lòng với sản phẩm của chúng tôi? Bạn hoàn toàn có thể trả lại sản phẩm{' '}
        <Text component='a' href='#' style={{ textDecoration: 'none', color: 'blue' }}>
          Tại đây
        </Text>
      </Text>
    </Paper>
  );
};
