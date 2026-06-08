import { Box, Group, SimpleGrid, Stack, Text } from '@mantine/core';
import { IconChefHat, IconHeartHandshake, IconTruckDelivery } from '@tabler/icons-react';

import Reveal from '~/components/Reveal';
import { SectionHeading } from '~/components/SectionHeading';

const values = [
  {
    icon: IconChefHat,
    title: 'Món ăn có linh hồn',
    desc: 'Không chỉ ngon, mỗi món đều có câu chuyện: vị miền Tây, cách làm chỉn chu và cảm giác thân thuộc.'
  },
  {
    icon: IconTruckDelivery,
    title: 'Nóng hổi đến tay',
    desc: 'Tối ưu quy trình bếp và giao hàng để món đến nơi vẫn giữ được độ ngon, giòn, nóng.'
  },
  {
    icon: IconHeartHandshake,
    title: 'Tử tế trong từng phần ăn',
    desc: 'Nguyên liệu rõ ràng, đóng gói sạch sẽ, khẩu vị dễ nhớ và dịch vụ khiến khách muốn quay lại.'
  }
];
export const SectionValues = () => {
  return (
    <>
      <Reveal z={40}>
        <Box>
          <SectionHeading
            index='02'
            title='Điều làm nên sự khác biệt'
            description='Không chỉ bán đồ ăn. Chúng tôi tạo ra trải nghiệm khiến khách muốn quay lại.'
            center
          />

          <SimpleGrid
            cols={{ base: 1, md: 3 }}
            spacing={0}
            mt='md'
            className='relative overflow-hidden rounded-[34px] border border-white/30 bg-[linear-gradient(135deg,rgba(255,248,232,0.9),rgba(255,255,255,0.78)_42%,rgba(255,241,209,0.82))] shadow-[0_28px_80px_rgba(15,23,42,0.12)] backdrop-blur-xl dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(30,24,18,0.92),rgba(17,24,39,0.86),rgba(44,32,18,0.9))]'
          >
            <Box className='pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-mainColor/10 blur-3xl' />
            <Box className='pointer-events-none absolute -bottom-28 left-20 h-72 w-72 rounded-full bg-subColor/20 blur-3xl' />

            {values.map((item, index) => (
              <Box
                key={item.title}
                className={[
                  'group relative min-h-[300px] overflow-hidden px-6 py-8 transition duration-300 sm:px-8 sm:py-10',
                  'hover:bg-white/30 dark:hover:bg-white/[0.04]',
                  index !== values.length - 1
                    ? 'border-slate-900/8 border-b dark:border-white/10 md:border-b-0 md:border-r'
                    : ''
                ].join(' ')}
              >
                <Box className='pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100'>
                  <Box className='bg-mainColor/12 absolute -right-14 -top-14 h-36 w-36 rounded-full blur-2xl' />
                  <Box className='bg-subColor/18 absolute -bottom-16 left-6 h-32 w-32 rounded-full blur-2xl' />
                </Box>

                <Box className='pointer-events-none absolute right-6 top-6 font-quicksand text-[72px] font-black leading-none text-slate-900/[0.035] transition duration-300 group-hover:text-mainColor/[0.07] dark:text-white/[0.04]'>
                  0{index + 1}
                </Box>

                <Stack justify='space-between' className='relative z-[1] min-h-[220px]'>
                  <Box>
                    <Group gap='xs'>
                      <Box className='h-px w-8 bg-mainColor/70 transition-all duration-300 group-hover:w-12' />
                      <Text className='font-quicksand text-xs font-black uppercase tracking-[0.28em] text-mainColor/80'>
                        Giá trị 0{index + 1}
                      </Text>
                    </Group>

                    <Text
                      mt={34}
                      className='max-w-[270px] font-quicksand text-[26px] font-black leading-[1.08] text-slate-950 dark:text-white'
                    >
                      {item.title}
                    </Text>

                    <Text mt={18} className='max-w-[320px] text-[15px] leading-7 text-slate-600 dark:text-dark-muted'>
                      {item.desc}
                    </Text>
                  </Box>

                  <Box className='pt-6'>
                    <Box className='flex items-center gap-3'>
                      <Box className='h-px flex-1 bg-gradient-to-r from-mainColor/45 via-subColor/35 to-transparent' />

                      <Box className='h-2 w-2 rounded-full bg-mainColor/70 shadow-[0_0_0_6px_rgba(21,93,252,0.08)] transition duration-300 group-hover:scale-125 group-hover:bg-subColor' />
                    </Box>
                  </Box>
                </Stack>

                <Box className='pointer-events-none absolute bottom-0 left-0 h-[3px] w-0 bg-gradient-to-r from-mainColor via-subColor to-mainColor transition-all duration-500 group-hover:w-full' />
              </Box>
            ))}
          </SimpleGrid>
        </Box>
      </Reveal>
    </>
  );
};
