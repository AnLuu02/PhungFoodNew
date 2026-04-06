import { Badge, Box, Flex, Paper, Switch, Text, TextInput } from '@mantine/core';
import { Controller, useFormContext } from 'react-hook-form';

export const OpeningTabItems = ({ item, index }: { item: any; index: number }) => {
  const { control, watch } = useFormContext();
  const name = `openingHours.${index}`;
  const watchedOpeningHour = watch(name);
  return (
    <>
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
            {item?.viNameDay}
          </Text>
        </Box>
        <Controller
          control={control}
          name={`${name}.viNameDay`}
          render={({ field, fieldState }) => (
            <TextInput {...field} className='hidden' error={fieldState.error?.message} radius='md' />
          )}
        />
        <Controller
          control={control}
          name={`${name}.isClosed`}
          render={({ field, fieldState }) => (
            <Flex align={'center'} gap={'xl'}>
              <Switch
                id={`openingTime_${index}`}
                checked={!field.value}
                onChange={event => field.onChange(!event.currentTarget.checked)}
                onBlur={field.onBlur}
                name={field.name}
                error={fieldState.error?.message}
              />
              <Text size='sm' fw={700}>
                {watchedOpeningHour?.isClosed ? 'Đóng cửa' : 'Mở cửa'}
              </Text>
            </Flex>
          )}
        />

        {!watchedOpeningHour?.isClosed && (
          <Box className='flex items-center gap-2'>
            <Controller
              control={control}
              name={`${name}.openTime`}
              render={({ field, fieldState }) => (
                <TextInput {...field} type='time' className='w-32' error={fieldState.error?.message} radius='md' />
              )}
            />
            <Text size='sm' fw={700}>
              đến
            </Text>
            <Controller
              control={control}
              name={`${name}.closeTime`}
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
            bg={watchedOpeningHour?.isClosed ? 'red' : ''}
            variant={watchedOpeningHour?.isClosed ? 'filled' : 'default'}
          >
            {watchedOpeningHour?.isClosed ? 'Đã đóng cừa' : `${item?.openTime} - ${item?.closeTime}`}
          </Badge>
        </Box>
      </Paper>
    </>
  );
};
