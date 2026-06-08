import { Box, Group, Paper, SimpleGrid, Text, ThemeIcon } from '@mantine/core';
import { IconFlame, IconMoodSmile, IconPackage, IconShieldCheck } from '@tabler/icons-react';

import Reveal from '~/components/Reveal';
import { SectionHeading } from '~/components/SectionHeading';

const processSteps = [
  {
    icon: IconShieldCheck,
    title: 'Chọn nguyên liệu',
    desc: 'Nguyên liệu được kiểm tra kỹ trước khi nhập bếp.'
  },
  {
    icon: IconFlame,
    title: 'Chế biến nóng mới',
    desc: 'Món được làm khi có đơn để giữ độ ngon tốt nhất.'
  },
  {
    icon: IconPackage,
    title: 'Đóng gói cẩn thận',
    desc: 'Bao bì sạch, chắc chắn, giữ nhiệt và dễ mang đi.'
  },
  {
    icon: IconMoodSmile,
    title: 'Giao đến khách hàng',
    desc: 'Đơn hàng được xử lý nhanh, rõ trạng thái và dễ theo dõi.'
  }
];
export const SectionProcessSteps = () => {
  return (
    <>
      <Reveal z={40}>
        <Box>
          <SectionHeading
            index='04'
            title='Từ căn bếp đến tay bạn'
            description='Chúng tôi thiết kế quy trình phục vụ để mỗi đơn hàng không chỉ nhanh, mà còn chỉn chu.'
            center
          />

          <SimpleGrid mt='md' cols={{ base: 1, sm: 1, lg: processSteps.length }} spacing={{ base: 0, lg: 'xl' }}>
            {processSteps.map((step, index) => {
              const isLast = index === processSteps.length - 1;

              return (
                <Box key={step.title} className={['group relative', !isLast ? 'pb-7 lg:pb-0' : ''].join(' ')}>
                  {!isLast && (
                    <div className='absolute left-9 top-[72px] z-0 h-[calc(100%-72px)] w-px bg-gradient-to-b from-mainColor/35 via-mainColor/20 to-transparent lg:hidden' />
                  )}

                  {!isLast && (
                    <div className='absolute left-[calc(50%+36px)] top-9 z-0 hidden h-px w-[calc(100%-72px)] bg-gradient-to-r from-mainColor/35 via-mainColor/20 to-transparent lg:block' />
                  )}

                  <Box className='relative z-[1] flex items-start gap-4 lg:block lg:text-center'>
                    <ThemeIcon
                      size={72}
                      radius='xl'
                      className='shrink-0 rounded-full border border-mainColor/15 bg-white text-mainColor shadow-sm shadow-mainColor/10 transition-all duration-300 group-hover:-translate-y-1 group-hover:border-mainColor/30 group-hover:bg-mainColor group-hover:text-white dark:border-white/10 dark:bg-dark-card'
                    >
                      <step.icon size={30} stroke={2} />
                    </ThemeIcon>

                    <Paper
                      radius={'xl'}
                      className='mt-1 w-full border border-slate-200/80 bg-white/85 p-5 shadow-sm backdrop-blur-sm transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-mainColor/25 group-hover:shadow-md dark:border-white/10 dark:bg-dark-card/85 lg:mt-5'
                    >
                      <Group gap='xs' className='justify-start lg:justify-center'>
                        <Text
                          size='xs'
                          fw={900}
                          className='rounded-full bg-mainColor/10 px-2.5 py-1 uppercase tracking-[0.16em] text-mainColor'
                        >
                          Bước {index + 1}
                        </Text>
                      </Group>

                      <Text
                        mt='sm'
                        className='font-quicksand text-base font-black text-slate-950 dark:text-white sm:text-lg'
                      >
                        {step.title}
                      </Text>

                      <Text mt='xs' size='sm' c='dimmed' className='leading-7'>
                        {step.desc}
                      </Text>
                    </Paper>
                  </Box>
                </Box>
              );
            })}
          </SimpleGrid>
        </Box>
      </Reveal>
    </>
  );
};
