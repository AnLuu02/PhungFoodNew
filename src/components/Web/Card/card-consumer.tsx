'use client';

import { Badge, Box, Button, Card, Text, Title, Tooltip } from '@mantine/core';
import { IconClock } from '@tabler/icons-react';
import Image from 'next/image';
import Link from 'next/link';
import { formatDateViVN } from '~/lib/func-handler/Format';

export function ConsumerCard({ data }: any) {
  return (
    <Link href={data?.link} target='_blank'>
      <Card
        padding={0}
        withBorder
        shadow='xl'
        radius={'md'}
        className='group w-full cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-lg'
      >
        <Box className='relative overflow-hidden' w={'100%'} h={200}>
          <Image
            src={data?.image || `/images/png/403.png`}
            alt={data?.title}
            fill
            className='object-cover transition-transform duration-300 group-hover:scale-105'
          />
          <Badge className='absolute left-3 top-3 bg-red-500 text-white hover:bg-red-600'>Nổi bật</Badge>
          <Badge className='absolute right-3 top-3'>{data?.categories?.[0]}</Badge>
        </Box>

        <Box className='p-4'>
          <Title className='mb-2 line-clamp-2 font-quicksand text-lg font-semibold text-gray-900 transition-colors group-hover:text-mainColor dark:text-white'>
            {data?.title?.length < 30 ? data?.title + ' (nguồn: vnexpress.net)' : data?.title}
          </Title>
          <Text className='mb-3 line-clamp-2 text-sm text-gray-600 dark:text-white'>{data?.description}</Text>

          <Box className='mb-3 flex items-center justify-between text-xs text-gray-500 dark:text-white'>
            <Box className='flex items-center space-x-1'>
              <IconClock className='h-3 w-3' />
              <span>{formatDateViVN(data.pubDate)}</span>
            </Box>
            <Tooltip label={data?.link}>
              <Text size='sm' c={'dimmed'} lineClamp={1} w={'50%'}>
                {data?.link}
              </Text>
            </Tooltip>
          </Box>

          <Button
            variant='outline'
            size='sm'
            className='w-full border-mainColor/20 bg-transparent text-mainColor hover:border-mainColor/20 hover:bg-mainColor/10 hover:text-mainColor'
          >
            Đọc thêm
          </Button>
        </Box>
      </Card>
    </Link>
  );
}
