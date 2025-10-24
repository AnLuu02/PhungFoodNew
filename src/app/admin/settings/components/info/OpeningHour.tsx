'use client';

import { Badge, Box, Flex, Paper, Switch, Text, TextInput, Title } from '@mantine/core';
import { IconClock } from '@tabler/icons-react';
import { Controller } from 'react-hook-form';
export default function OpeningHour({ restaurant, control, watch }: { restaurant: any; control: any; watch: any }) {
  const hours = restaurant?.openingHours || [];
  return (
    <Paper radius={'md'} shadow='md' p={'lg'} className='bg-gray-100 dark:bg-dark-card'>
      <Flex align={'center'} justify={'space-between'}>
        <Box mb={'xl'}>
          <Title order={4} className='flex items-center gap-2 font-quicksand'>
            <IconClock className='h-5 w-5' />
            Giờ hoạt động
          </Title>
          <Text fw={600} size={'sm'} c={'dimmed'}>
            Đặt thời gian mở và đóng cửa của nhà hàng của bạn cho mỗi ngày
          </Text>
        </Box>
      </Flex>
      <Box className='space-y-4'>
        {hours.map((item: any, index: number) => (
          <Paper
            component='label'
            htmlFor={`openingTime_${index}`}
            withBorder
            radius={'md'}
            key={index}
            className='flex items-center gap-4 bg-gray-100 p-4 dark:bg-dark-card'
            mih={83}
          >
            <Box className='w-24'>
              <Text fw={600} className='font-medium capitalize'>
                {item.viNameDay}
              </Text>
            </Box>
            <Controller
              control={control}
              name={`openingHours.${index}.viNameDay`}
              render={({ field, fieldState }) => (
                <TextInput {...field} className='hidden' error={fieldState.error?.message} radius='md' />
              )}
            />
            <Controller
              control={control}
              name={`openingHours.${index}.isClosed`}
              render={({ field, fieldState }) => (
                <Flex align={'center'} gap={'xl'}>
                  <Switch
                    id={`openingTime_${index}`}
                    checked={field.value}
                    onChange={event => field.onChange(event.currentTarget.checked)}
                    onBlur={field.onBlur}
                    name={field.name}
                    error={fieldState.error?.message}
                  />
                  <Text size='sm' fw={700}>
                    {watch(`openingHours.${index}.isClosed`) ? 'Đóng cửa' : 'Mở cửa'}
                  </Text>
                </Flex>
              )}
            />

            {!watch(`openingHours.${index}.isClosed`) && (
              <Box className='flex items-center gap-2'>
                <Controller
                  control={control}
                  name={`openingHours.${index}.openTime`}
                  render={({ field, fieldState }) => (
                    <TextInput {...field} type='time' className='w-32' error={fieldState.error?.message} radius='md' />
                  )}
                />
                <Text size='sm' fw={700}>
                  đến
                </Text>
                <Controller
                  control={control}
                  name={`openingHours.${index}.closeTime`}
                  render={({ field, fieldState }) => (
                    <TextInput type='time' {...field} className='w-32' error={fieldState.error?.message} radius='md' />
                  )}
                />
              </Box>
            )}

            <Box className='ml-auto'>
              <Badge
                size='lg'
                radius={'md'}
                bg={watch(`openingHours.${index}.isClosed`) ? 'red' : ''}
                variant={watch(`openingHours.${index}.isClosed`) ? 'filled' : 'default'}
              >
                {watch(`openingHours.${index}.isClosed`) ? 'Closed' : `${item.openTime} - ${item.closeTime}`}
              </Badge>
            </Box>
          </Paper>
        ))}
      </Box>
    </Paper>
  );
}
