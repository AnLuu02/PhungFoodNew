'use client';
import { Card, Group, Paper, Radio, ScrollAreaAutosize, Skeleton, Stack, Text, Title } from '@mantine/core';
import { PaymentType } from '@prisma/client';
import { Controller } from 'react-hook-form';
import { api } from '~/trpc/react';
export const PaymentForm = ({ control }: any) => {
  const { data: paymentData, isLoading } = api.Payment.getAll.useQuery();
  const payment = paymentData ?? [];

  return (
    <Card shadow='sm' padding='lg' radius='md' withBorder>
      <Title order={3} className='mb-4 font-quicksand'>
        Phương Thức Thanh Toán
      </Title>
      <ScrollAreaAutosize mah={480} px='0' scrollbarSize={5}>
        <Paper withBorder p='md' radius='md'>
          <Text size='md' fw={700}>
            Vui lòng chọn ví điện tử của bạn:
          </Text>
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
                  <Group mt='sm'>
                    {payment?.map(
                      (item: any, index: number) =>
                        item.type === PaymentType.E_WALLET && (
                          <Radio key={index} value={item.id} label={item.name} error={fieldState.error?.message} />
                        )
                    )}
                  </Group>
                </Radio.Group>
              )}
            />
          )}
        </Paper>
      </ScrollAreaAutosize>
    </Card>
  );
};
