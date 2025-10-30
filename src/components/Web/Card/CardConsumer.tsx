'use client';

import { Badge, Box, Card, Text, Title, Tooltip } from '@mantine/core';
import { IconClock } from '@tabler/icons-react';
import Image from 'next/image';
import Link from 'next/link';
import BButton from '~/components/Button/Button';
import { formatDateViVN } from '~/lib/FuncHandler/Format';

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
            onError={e => (e.currentTarget.src = '/images/png/delicious-burger-fries.png')}
            className='object-cover transition-transform duration-300 group-hover:scale-105'
          />
          <Badge className='absolute left-3 top-3 bg-red-500 text-white hover:bg-red-600'>Nổi bật</Badge>
          <Badge className='absolute right-3 top-3' classNames={{ root: 'bg-mainColor' }}>
            {data?.categories?.[0]}
          </Badge>
        </Box>

        <Box className='p-4'>
          <Title className='mb-2 line-clamp-2 font-quicksand text-lg font-semibold text-gray-900 transition-colors group-hover:text-mainColor dark:text-dark-text'>
            {data?.title?.length < 30 ? data?.title + ' (nguồn: vnexpress.net)' : data?.title}
          </Title>
          <Text className='mb-3 line-clamp-2 text-sm text-gray-600 dark:text-dark-text'>{data?.description}</Text>

          <Box className='mb-3 flex items-center justify-between text-xs text-gray-500 dark:text-dark-text'>
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

          <BButton children='Đọc thêm' variant='outline' fullWidth />
        </Box>
      </Card>
    </Link>
  );
}
