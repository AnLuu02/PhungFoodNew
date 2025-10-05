import { Box, Divider, Flex, Stack, Text, Title } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { IconCalendar } from '@tabler/icons-react';
import type { Metadata } from 'next';
import { ReportsOther } from './components/reports-other';

export const metadata: Metadata = {
  title: 'Next.js E-commerce Dashboard | TailAdmin - Next.js Dashboard Template',
  description: 'This is Next.js Home for TailAdmin Dashboard Template'
};

export default function Ecommerce() {
  return (
    <>
      <Divider my={'md'} />
      <Stack gap={'lg'} pb={'xl'} mb={'xl'}>
        <Flex align={'center'} justify={'space-between'}>
          <Box>
            <Title mb={4} className='font-quicksand' order={2}>
              Analytics dashboard
            </Title>
            <Text size='sm' c={'dimmed'}>
              Phân tích hành vi trong hệ thống PhungFood
            </Text>
          </Box>
          <DatePickerInput type='range' size='xs' leftSection={<IconCalendar size={20} />} placeholder='Pick a date' />
        </Flex>
        <ReportsOther />
      </Stack>
    </>
  );
}
