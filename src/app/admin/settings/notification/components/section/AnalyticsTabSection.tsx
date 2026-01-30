'use client';

import { Box, Card, Text } from '@mantine/core';
import { IconCircleCheck, IconEye, IconMessages, IconSend } from '@tabler/icons-react';

export const AnalyticsTabSection = () => {
  return (
    <>
      <Box className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card withBorder radius={'lg'}>
          <Box className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <Text className='text-sm font-medium'>Tổng số đã gửi</Text>
            <IconSend className='h-4 w-4' />
          </Box>
          <Box>
            <Box className='text-2xl font-bold'>2,451</Box>
            <Text className='text-xs'>+12% từ tháng trước</Text>
          </Box>
        </Card>
        <Card withBorder radius={'lg'}>
          <Box className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <Text className='text-sm font-medium'>Tỷ lệ chuyển tiếp</Text>
            <IconCircleCheck className='h-4 w-4' />
          </Box>
          <Box>
            <Box className='text-2xl font-bold'>94.3%</Box>
            <Text className='text-xs'>+2.1% từ tháng trước</Text>
          </Box>
        </Card>
        <Card withBorder radius={'lg'}>
          <Box className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <Text className='text-sm font-medium'>Tỉ lệ đọc</Text>
            <IconEye className='h-4 w-4' />
          </Box>
          <Box>
            <Box className='text-2xl font-bold'>71.8%</Box>
            <Text className='text-xs'>+5.2% từ tháng trước</Text>
          </Box>
        </Card>
        <Card withBorder radius={'lg'}>
          <Box className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <Text className='text-sm font-medium'>Tỷ lệ truy cập</Text>
            <IconMessages className='h-4 w-4' />
          </Box>
          <Box>
            <Box className='text-2xl font-bold'>18.5%</Box>
            <Text className='text-xs'>+1.8% từ tháng trước</Text>
          </Box>
        </Card>
      </Box>

      <Card withBorder radius={'lg'}>
        <Box mb={'md'}>
          <Text fw={700} size='xl'>
            Hiệu suất theo Loại thông báo
          </Text>
          <Text size='sm'>Hiệu suất của các loại thông báo khác nhau</Text>
        </Box>
        <Box>
          <Box className='space-y-4'>
            {[
              {
                type: 'Promotion',
                viName: 'Khuyễn mãi',
                sent: 856,
                delivered: 812,
                read: 634,
                clicked: 187,
                color: 'bg-purple-500'
              },
              {
                type: 'Order Updates',
                viName: 'Câp nhật đơn hàng',
                sent: 1245,
                delivered: 1198,
                read: 1089,
                clicked: 45,
                color: 'bg-green-500'
              },
              {
                type: 'System Alerts',
                viName: 'Thống báo hệ thống',
                sent: 234,
                delivered: 221,
                read: 198,
                clicked: 12,
                color: 'bg-orange-500'
              },
              {
                type: 'General Info',
                viName: 'Thống báo chung',
                sent: 116,
                delivered: 108,
                read: 87,
                clicked: 8,
                color: 'bg-blue-500'
              }
            ].map((item, index) => (
              <Card withBorder radius={'lg'} key={index} className='space-y-2'>
                <Box className='flex items-center justify-between'>
                  <Box className='flex items-center gap-2'>
                    <Box className={`h-3 w-3 rounded-full ${item.color}`}></Box>
                    <Text fw={700}>{item.viName}</Text>
                  </Box>
                  <Text size='sm'>
                    <b>{((item.read / item.sent) * 100).toFixed(1)}%</b> tỉ lệ đọc
                  </Text>
                </Box>
                <Box className='grid grid-cols-4 gap-4 text-sm'>
                  <Box className='text-center'>
                    <Text fw={700} size='sm'>
                      {item.sent}
                    </Text>
                    <Text size='sm'>Đã gửi</Text>
                  </Box>
                  <Box className='text-center'>
                    <Text fw={700} size='sm'>
                      {item.delivered}
                    </Text>
                    <Text size='sm'>Đã nhận được</Text>
                  </Box>
                  <Box className='text-center'>
                    <Text fw={700} size='sm'>
                      {item.read}
                    </Text>
                    <Text size='sm'>Đã đọc</Text>
                  </Box>
                  <Box className='text-center'>
                    <Text fw={700} size='sm'>
                      {item.clicked}
                    </Text>
                    <Text size='sm'>Đã truy cập</Text>
                  </Box>
                </Box>
              </Card>
            ))}
          </Box>
        </Box>
      </Card>
    </>
  );
};
