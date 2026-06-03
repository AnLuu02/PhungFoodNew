import { Avatar, Box, Button, Card, Group, Text } from '@mantine/core';
import { UserLevel } from '@prisma/client';
import { IconArrowRight, IconStar } from '@tabler/icons-react';
import Link from 'next/link';
import Reveal from '~/components/Reveal';
import { INFO_LEVEL_USER } from '~/shared/constants/user.constants';
import { GetInitAboutUs } from '~/shared/type-trpc/page.type-trpc';
import { SectionHeading } from '../../../../components/SectionHeading';

export const SectionTestimonials = ({ reviewsPagination }: { reviewsPagination: GetInitAboutUs['topReviews'] }) => {
  const reviews = reviewsPagination?.reviews ?? [];
  return (
    <Reveal z={40}>
      <Box>
        <Group justify='space-between' align='end' mb={32}>
          <SectionHeading
            index='08'
            title='Một lần đặt, nhiều lần quay lại'
            description='Cảm nhận thật từ những khách hàng đã chọn Phụng Food cho bữa ăn mỗi ngày.'
          />

          <Button
            component={Link}
            href='/thuc-don'
            radius='xl'
            rightSection={<IconArrowRight size={17} />}
            visibleFrom='md'
          >
            Đặt món thử ngay
          </Button>
        </Group>
        <Box className='flex gap-5 overflow-x-auto pb-3 lg:grid lg:grid-cols-3 lg:overflow-visible'>
          {reviews.map(item => {
            const levelUser = INFO_LEVEL_USER[item.user.level || UserLevel.BRONZE];
            return (
              <Card
                key={item.id}
                radius={28}
                p='xl'
                className='min-w-[82vw] border bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-dark-card sm:min-w-[420px] lg:min-w-0'
              >
                <Group align='center'>
                  <Avatar src='/images/jpg/empty-300x240.jpg' size={58} radius='xl' />
                  <Box>
                    <Text fw={900}>{item.user.name || 'Khách hàng thân thiết'}</Text>
                    <Text size='sm' c='dimmed'>
                      Cấp độ: {levelUser.viName}
                    </Text>
                  </Box>
                </Group>

                <Text mt='lg' c='dimmed' className='leading-7'>
                  “{item.comment || 'Đang cập nhật'}”
                </Text>

                <Group gap={4} mt='lg'>
                  {Array.from({ length: item?.rating || 5 }).map((_, index) => (
                    <IconStar key={index} size={18} className='fill-yellow-400 text-yellow-400' />
                  ))}
                </Group>
              </Card>
            );
          })}
        </Box>
      </Box>
    </Reveal>
  );
};
