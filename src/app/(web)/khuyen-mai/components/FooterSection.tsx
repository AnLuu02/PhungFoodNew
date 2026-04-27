'use client';
import { ActionIcon, Box, Button, Grid, GridCol, Group, Text, Title } from '@mantine/core';
import { IconBolt, IconCheck, IconClock } from '@tabler/icons-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function FooterSection() {
  const { data: session } = useSession();
  return (
    <Box className='relative overflow-hidden bg-mainColor px-4 py-16 text-white sm:py-24'>
      <Box className='relative z-10 mx-auto max-w-6xl text-center'>
        <>
          <Title className='mb-8 text-balance font-quicksand text-6xl font-bold text-white'>
            🚀 Sẵn Sàng Bắt Đầu Kiếm Điểm?
          </Title>
          <Text className='text-md mx-auto mb-6 max-w-4xl text-pretty font-medium leading-relaxed text-white/90 md:mb-10 md:text-2xl'>
            Tham gia cùng hơn <b>50.000 thành viên</b> đang tiết kiệm tiền và tận hưởng các đặc quyền độc quyền. Đăng ký
            chỉ mất chưa đến 2 phút và bạn sẽ bắt đầu kiếm điểm ngay lập tức!
          </Text>
          {session?.user?.id ? (
            <Box className='flex flex-col items-center justify-center gap-8 sm:flex-row'>
              <Button
                size='lg'
                className='h-auto bg-subColor px-6 py-3 text-lg text-black shadow-xl duration-300 hover:scale-105 hover:bg-mainColor hover:text-white'
              >
                <Link href={'/thuc-don'}> 🛒 Đặt món ngay</Link>
              </Button>

              <Button
                size='lg'
                variant='outline'
                className='h-auto border-subColor px-6 py-3 text-lg text-white shadow-xl duration-300 hover:scale-105 hover:border-mainColor hover:text-subColor'
              >
                <Link href={'/thong-tin'}> 👑 Xem Tiến Trình</Link>
              </Button>
            </Box>
          ) : (
            <Box className='flex flex-col items-center justify-center gap-8 sm:flex-row'>
              <Button
                size='lg'
                className='h-auto bg-subColor px-6 py-3 text-lg text-black shadow-xl duration-300 hover:scale-105 hover:bg-mainColor hover:text-white'
              >
                <Link href={'/dang-nhap'}> 🔑 Đăng nhập ngay</Link>
              </Button>

              <Button
                size='lg'
                variant='outline'
                className='h-auto border-subColor px-6 py-3 text-lg text-white shadow-xl duration-300 hover:scale-105 hover:border-mainColor hover:text-subColor'
              >
                <Link href={'/dang-nhap'}> 👑 Tham Gia Miễn Phí - Nhận 500 Điểm!</Link>
              </Button>
            </Box>
          )}
        </>

        <Box className='mt-10 text-white/95'>
          <Grid justify='center'>
            <GridCol span={4}>
              <Group gap={8} align='center' className='justify-center sm:justify-end'>
                <ActionIcon radius={'xl'} className='bg-green-500'>
                  <IconCheck size={20} stroke={2} />
                </ActionIcon>
                <Text className='font-medium text-white/95'>Không phí dịch vụ</Text>
              </Group>
            </GridCol>
            <GridCol span={4}>
              <Group gap={8} align='center' className='justify-center'>
                <ActionIcon radius={'xl'} className='bg-blue-500'>
                  <IconClock size={20} stroke={2} />
                </ActionIcon>
                <Text className='font-medium text-white/95'>Điểm không bao giờ hết hạn</Text>
              </Group>
            </GridCol>
            <GridCol span={4}>
              <Group gap={8} align='center' className='justify-center sm:justify-start'>
                <ActionIcon radius={'xl'} className='bg-yellow-500'>
                  <IconBolt size={20} stroke={2} />
                </ActionIcon>
                <Text className='font-medium text-white/95'>Quyền lợi tức thì</Text>
              </Group>
            </GridCol>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}
