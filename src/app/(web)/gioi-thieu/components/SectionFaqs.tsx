'use client';
import {
  Accordion,
  AccordionControl,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title
} from '@mantine/core';
import { IconArrowRight, IconMessageQuestion } from '@tabler/icons-react';
import Link from 'next/link';
import Reveal from '~/components/Reveal';

const faqs = [
  {
    q: 'Phụng Food có giao hàng không?',
    a: 'Có. Bạn có thể đặt món trực tiếp trên website và theo dõi trạng thái đơn hàng.'
  },
  {
    q: 'Món ăn có được làm mới khi đặt không?',
    a: 'Có. Các món chính được chế biến sau khi có đơn để đảm bảo độ nóng và hương vị.'
  },
  {
    q: 'Nguyên liệu có đảm bảo luôn tươi không?',
    a: 'Có. Nguyên liệu được nhập mỗi ngày, có hóa đơn chứng từ đầy đủ.'
  },
  {
    q: 'Có chương trình thành viên không?',
    a: 'Có. Khách hàng có thể tích điểm, nhận voucher và ưu đãi theo cấp độ thành viên.'
  }
];

export const SectionFaqs = () => {
  return (
    <>
      <Reveal z={40}>
        <Paper
          p={{ base: 'lg', md: 48 }}
          radius={'xl'}
          className='relative overflow-hidden border border-slate-200 bg-backgroundAdmin shadow-sm dark:border-white/10 dark:bg-dark-card'
        >
          <Box className='absolute -right-24 -top-24 h-72 w-72 rounded-full bg-mainColor/10 blur-3xl' />
          <Box className='absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-subColor/20 blur-3xl' />

          <SimpleGrid cols={{ base: 1, md: 2 }} spacing={{ base: 34, md: 56 }} className='relative items-start'>
            <Stack gap='xl' className='md:sticky md:top-24'>
              <Box>
                <Group gap='sm' mb='md'>
                  <Box className='h-px w-10 bg-mainColor' />
                  <Text size='xs' fw={900} tt='uppercase' lts={3} className='text-mainColor'>
                    Hỏi nhanh trước khi đặt
                  </Text>
                </Group>

                <Title className='max-w-xl text-balance font-quicksand text-3xl font-black leading-tight text-slate-950 dark:text-white md:text-5xl'>
                  Một vài điều khách thường hỏi.
                </Title>

                <Text mt='md' className='max-w-lg text-base leading-7 text-slate-600 dark:text-dark-muted md:text-lg'>
                  Những thông tin cần biết trước khi đặt món: thời gian chuẩn bị, giao hàng, thanh toán và cách dùng ưu
                  đãi.
                </Text>
              </Box>

              <Paper
                p='lg'
                radius={'xl'}
                className='relative overflow-hidden border border-mainColor/10 bg-white shadow-sm dark:border-white/10 dark:bg-white/5'
              >
                <Box className='absolute -right-10 -top-10 h-28 w-28 rounded-full bg-mainColor/10' />

                <Group align='flex-start' wrap='nowrap'>
                  <ThemeIcon size={48} radius='xl' className='shrink-0 bg-mainColor text-white'>
                    <IconMessageQuestion size={23} />
                  </ThemeIcon>

                  <Box>
                    <Text fw={900} className='font-quicksand text-lg text-slate-950 dark:text-white'>
                      Cần trả lời nhanh hơn?
                    </Text>

                    <Text mt={4} size='sm' c='dimmed' className='leading-6'>
                      Nếu câu hỏi chưa có trong danh sách, bạn có thể liên hệ trực tiếp để được hỗ trợ trước khi đặt
                      món.
                    </Text>

                    <Button
                      component={Link}
                      href='/lien-he'
                      mt='md'
                      size='sm'
                      variant='light'
                      rightSection={<IconArrowRight size={16} />}
                    >
                      Liên hệ hỗ trợ
                    </Button>
                  </Box>
                </Group>
              </Paper>
            </Stack>

            <Accordion
              variant='contained'
              chevronPosition='right'
              radius={'xl'}
              classNames={{
                root: 'space-y-3',
                item: 'overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 data-[active=true]:border-mainColor/30 data-[active=true]:shadow-md dark:border-white/10 dark:bg-white/5',
                control: 'px-4 py-4 hover:bg-mainColor/[0.04] data-[active=true]:bg-mainColor/[0.06]',
                content: 'px-4 pb-4',
                chevron: 'text-mainColor'
              }}
            >
              {faqs.map((item, index) => (
                <AccordionItem key={item.q} value={item.q}>
                  <AccordionControl>
                    <Group gap='md' wrap='nowrap' align='flex-start'>
                      <ThemeIcon
                        size={34}
                        radius='xl'
                        variant='light'
                        className='shrink-0 bg-mainColor/10 text-mainColor'
                      >
                        <Text size='xs' fw={900}>
                          {String(index + 1).padStart(2, '0')}
                        </Text>
                      </ThemeIcon>

                      <Text fw={900} className='text-left font-quicksand text-slate-950 dark:text-white'>
                        {item.q}
                      </Text>
                    </Group>
                  </AccordionControl>

                  <AccordionPanel>
                    <Box className='ml-[50px] border-l border-mainColor/20 pl-4'>
                      <Text c='dimmed' className='leading-7'>
                        {item.a}
                      </Text>
                    </Box>
                  </AccordionPanel>
                </AccordionItem>
              ))}
            </Accordion>
          </SimpleGrid>
        </Paper>
      </Reveal>
    </>
  );
};
