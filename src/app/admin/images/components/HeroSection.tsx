'use client';

import { IconPhoto } from '@tabler/icons-react';

import { Box, Card, Flex, Progress, Stack, Text, Title, Tooltip } from '@mantine/core';
import { useMemo } from 'react';
import { ImageWithAssociations } from '../types/image.types';

export default function HeroSectionImages({
  imagesData
}: {
  imagesData:
    | {
        data: ImageWithAssociations[];
        total: number;
        pageInfo: {
          skip: number;
          take: number;
          hasMore: boolean;
        };
      }
    | undefined;
}) {
  const orphanedCount = useMemo(() => imagesData?.data.filter(img => img.isOrphaned).length ?? 0, [imagesData?.data]);
  const unused = orphanedCount;
  const total = imagesData?.total ?? 0;
  const linked = total - unused;

  const linkedHeight = (linked / total) * 100;
  const unusedHeight = (unused / total) * 100;

  return (
    <>
      <Box className='grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-6'>
        <Card radius='xl' className='relative col-span-3 flex justify-center bg-gray-100 p-8 dark:bg-dark-card'>
          <Stack gap={4}>
            <Title order={1} className='font-quicksand'>
              Thư viện hình ảnh
            </Title>
            <Text c='dimmed' size='sm'>
              Quản lý và sắp xếp các tài sản hình ảnh về ẩm thực của bạn.{' '}
            </Text>
          </Stack>

          <IconPhoto size={80} className='absolute right-6 top-6 opacity-10' />
        </Card>

        <Card radius='xl' p='lg' h={200} className='bg-[#e0e7ff]/40 dark:bg-dark-card'>
          <Flex direction={'column'} justify={'space-between'} h={'100%'}>
            <Text size='md' fw={700} c='dimmed'>
              Tổng lưu trữ
            </Text>
            <Box>
              <Title order={1} className='font-quicksand text-mainColor'>
                1,284
              </Title>
              <Text size='sm' className='text-mainColor'>
                +12 trong tuần này
              </Text>
            </Box>
          </Flex>
        </Card>

        <Card radius='xl' p='lg' h={200} className='bg-[#e0e7ff]/40 dark:bg-dark-card'>
          <Flex direction={'column'} justify={'space-between'} h={'100%'}>
            <Text size='md' fw={700} c='dimmed'>
              Kho
            </Text>
            <Box>
              <Title order={1} className='font-quicksand text-mainColor'>
                84%
              </Title>
              <Progress value={84} mt='xs' />
            </Box>
          </Flex>
        </Card>

        <div className='flex h-[200px] w-full max-w-[250px] flex-col justify-between rounded-xl border border-mainColor/10 bg-[#e0e7ff]/60 p-6 dark:bg-dark-card md:col-span-full lg:col-span-1'>
          <Text className='mb-4 text-xs font-bold uppercase tracking-widest text-mainColor'>Xem nhanh</Text>

          <div className='flex flex-1 items-end justify-center gap-8 pb-2'>
            <Tooltip
              label={`Đã liên kết: ${linked}`}
              withArrow
              position='top'
              transitionProps={{ transition: 'pop', duration: 300 }}
            >
              <div
                className='group relative flex cursor-pointer flex-col items-center gap-2'
                style={{ height: '100%', justifyContent: 'flex-end' }}
              >
                <div
                  className='w-10 rounded-t-lg bg-mainColor transition-all duration-500 group-hover:shadow-lg group-hover:brightness-110'
                  style={{ height: `${linkedHeight}%` }}
                />
                <span className='text-[10px] font-bold text-gray-500'>LINKED</span>
              </div>
            </Tooltip>

            <Tooltip
              label={`Chưa liên kết: ${unused}`}
              withArrow
              position='top'
              transitionProps={{ transition: 'pop', duration: 300 }}
            >
              <div
                className='group relative flex cursor-pointer flex-col items-center gap-2'
                style={{ height: '100%', justifyContent: 'flex-end' }}
              >
                <div
                  className='w-10 rounded-t-lg bg-[#d1d5db] transition-all duration-500 group-hover:bg-[#9ca3af] group-hover:shadow-lg'
                  style={{ height: `${unusedHeight}%` }}
                />
                <span className='text-[10px] font-bold text-gray-500'>UNUSED</span>
              </div>
            </Tooltip>
          </div>
        </div>
      </Box>
    </>
  );
}
