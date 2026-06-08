'use client';

import { Avatar, Badge, Box, Button, Card, Divider, Group, Paper, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import Link from 'next/link';
import { formatMoneyShort } from '~/lib/FuncHandler/Format';
import { SectionHeading } from './SectionHeading';

export type TestimonialItem = {
  name: string;
  description?: string;
  avatar?: string;
  badge?: string;
  badgeClassName?: string;
  content: string;
  meta?: {
    label: string;
    value: string | number;
  }[];
};

export type TestimonialSectionProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  index: number;
  items: TestimonialItem[];
  centerHeading?: boolean;
  variant?: 'default' | 'minimal' | 'dark';
  cta?: {
    title: string;
    description?: string;
    label: string;
    href: string;
  };
};

export function TestimonialSection({
  eyebrow = 'Khách hàng nói gì',
  title,
  description,
  index,
  items,
  centerHeading = true,
  variant = 'default',
  cta
}: TestimonialSectionProps) {
  const isDarkVariant = variant === 'dark';
  const isMinimal = variant === 'minimal';

  return (
    <Stack gap='xl'>
      <Box ta={centerHeading ? 'center' : 'left'} className={centerHeading ? 'mx-auto max-w-3xl' : 'max-w-3xl'}>
        {eyebrow && (
          <Group justify={centerHeading ? 'center' : 'flex-start'} gap='xs' mb='sm'>
            <Box className='h-px w-8 bg-mainColor' />

            <Text size='xs' fw={900} className='uppercase tracking-[0.24em] text-mainColor'>
              {eyebrow}
            </Text>

            {centerHeading && <Box className='h-px w-8 bg-mainColor' />}
          </Group>
        )}

        <SectionHeading index={'0' + `${index}`} title={title} description={description ?? ''} center key={index} />
      </Box>

      <Box className='relative'>
        <Box className='mb-4 flex animate-slideRightPulse justify-end md:hidden'>
          <Group
            gap={4}
            className='rounded-full border border-slate-200 bg-white px-3 py-1.5 text-slate-500 shadow-sm dark:border-white/10 dark:bg-dark-card dark:text-dark-text'
          >
            <Text size='xs' fw={700} className='text-slate-500 dark:text-dark-text'>
              Kéo ngang để xem thêm
            </Text>
            <IconChevronRight size={12} />
          </Group>
        </Box>

        <Box className='flex snap-x gap-4 overflow-x-auto pb-3 lg:grid lg:grid-cols-3 lg:overflow-visible lg:pb-0'>
          {items.map((item, index) => (
            <Card
              key={`${item.name}-${index}`}
              radius={isMinimal ? 22 : 28}
              padding={isMinimal ? 'md' : 'lg'}
              className={[
                'min-w-[84vw] snap-start border border-solid transition duration-300 sm:min-w-[46vw] lg:min-w-0',
                isMinimal
                  ? 'border-slate-200 bg-transparent shadow-none dark:border-white/10'
                  : 'border-slate-200 bg-white shadow-[0_16px_50px_rgba(15,23,42,0.06)] hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(15,23,42,0.1)] dark:border-white/10 dark:bg-dark-card',
                isDarkVariant ? '!dark:bg-slate-950 !border-white/10 !bg-slate-950 !text-white' : ''
              ].join(' ')}
            >
              <Stack gap='lg' className='h-full'>
                <Group justify='space-between' align='flex-start' wrap='nowrap'>
                  <Group gap='sm' wrap='nowrap'>
                    <Avatar
                      src={item.avatar}
                      name={item.name}
                      size={52}
                      radius='xl'
                      className='border border-slate-200 dark:border-white/10'
                    />

                    <Box>
                      <Text
                        fw={950}
                        className={
                          isDarkVariant ? 'font-quicksand text-white' : 'font-quicksand text-slate-950 dark:text-white'
                        }
                      >
                        {item.name}
                      </Text>

                      {item.description ? (
                        <Text
                          size='sm'
                          className={isDarkVariant ? 'text-white/55' : ''}
                          c={isDarkVariant ? undefined : 'dimmed'}
                        >
                          {item.description}
                        </Text>
                      ) : item.badge ? (
                        <Badge radius='xl' className={item.badgeClassName || 'text-mainColor'}>
                          {item.badge}
                        </Badge>
                      ) : null}
                    </Box>
                  </Group>

                  <Text
                    className={[
                      'font-quicksand text-5xl font-black leading-none',
                      isDarkVariant ? 'text-white/[0.05]' : 'text-slate-100 dark:text-white/[0.04]'
                    ].join(' ')}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </Text>
                </Group>

                <Text
                  size='lg'
                  className={[
                    'font-medium italic leading-relaxed',
                    isDarkVariant ? 'text-white/90' : 'text-slate-700 dark:text-slate-300'
                  ].join(' ')}
                >
                  “{item.content}”
                </Text>

                {!!item.meta?.length && (
                  <Box className='mt-auto'>
                    <Divider className={isDarkVariant ? 'border-white/10' : 'border-slate-200 dark:border-white/10'} />

                    <SimpleGrid cols={item.meta.length} spacing='xs' mt='md'>
                      {item.meta.map(meta => (
                        <Paper
                          key={`${item.name}-${meta.label}`}
                          radius='lg'
                          p='sm'
                          className={
                            isDarkVariant
                              ? 'bg-white/[0.06] text-center'
                              : 'bg-slate-100 text-center dark:bg-white/[0.04]'
                          }
                        >
                          <Text
                            fw={950}
                            className={
                              isDarkVariant
                                ? 'font-quicksand text-white'
                                : 'font-quicksand text-slate-950 dark:text-white'
                            }
                          >
                            {typeof meta.value === 'number' ? formatMoneyShort(meta.value) : meta.value}
                          </Text>

                          <Text
                            size='xs'
                            className={isDarkVariant ? 'text-white/45' : ''}
                            c={isDarkVariant ? undefined : 'dimmed'}
                          >
                            {meta.label}
                          </Text>
                        </Paper>
                      ))}
                    </SimpleGrid>
                  </Box>
                )}
              </Stack>
            </Card>
          ))}
        </Box>
      </Box>

      {cta && (
        <Paper
          radius={28}
          p={{ base: 'lg', sm: 'xl' }}
          className='relative overflow-hidden border border-slate-200 bg-slate-950 text-white shadow-xl dark:border-white/10'
        >
          <Box className='pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-mainColor/25 blur-3xl' />
          <Box className='pointer-events-none absolute -bottom-24 left-10 h-64 w-64 rounded-full bg-subColor/20 blur-3xl' />

          <Group className='relative z-[1]' justify='space-between' align='center' gap='lg'>
            <Box className='max-w-2xl'>
              <Text size='sm' fw={900} className='uppercase tracking-[0.22em] text-white/50'>
                Tiếp tục trải nghiệm
              </Text>

              <Title mt='xs' order={3} className='font-quicksand text-2xl font-black sm:text-3xl'>
                {cta.title}
              </Title>

              {cta.description && (
                <Text mt='sm' className='text-white/65'>
                  {cta.description}
                </Text>
              )}
            </Box>

            <Button component={Link} href={cta.href} radius='xl' size='md'>
              {cta.label}
            </Button>
          </Group>
        </Paper>
      )}
    </Stack>
  );
}
