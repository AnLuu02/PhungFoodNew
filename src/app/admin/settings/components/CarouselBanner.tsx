'use client';

import { Carousel } from '@mantine/carousel';
import { ActionIcon, Box, Flex, Image, Paper, Stack, Text, Tooltip } from '@mantine/core';
import { IconChevronLeft, IconChevronRight, IconPlus, IconTrash } from '@tabler/icons-react';

export const CarouselBanner = ({ previewUrls, setValue, galleries, banner1, banner2 }: any) => {
  return (
    <>
      <Stack mb={'xl'}>
        <Flex gap='md' direction={{ base: 'column', lg: 'row' }}>
          <Box w={{ base: '100%', lg: '66.666667%' }}>
            {galleries && galleries.length > 0 ? (
              <Carousel
                withControls
                withIndicators
                loop
                nextControlIcon={<IconChevronRight size={30} />}
                previousControlIcon={<IconChevronLeft size={30} />}
                controlSize={40}
                color='black'
                classNames={{
                  control: 'border-none bg-white/80',
                  indicators: 'bottom-4',
                  indicator: 'mx-[6px] h-[8px] w-[20px] rounded-full bg-mainColor'
                }}
              >
                {previewUrls.map((src: any, index: number) => (
                  <Carousel.Slide key={index} className='rounded-md'>
                    <Box className='relative h-[400px] overflow-hidden rounded-md bg-gradient-to-b from-[#E1F5FE] to-[#FFF9C4]'>
                      <Image src={src} alt={`gallery-${index}`} w={'100%'} h='100%' className='rounded-md' />
                      {setValue && (
                        <Tooltip label={'Xóa'} withArrow>
                          <ActionIcon
                            onClick={() => {
                              const newGalleryImages = galleries!.filter((_: any, i: number) => i !== index);
                              setValue('gallery', newGalleryImages);
                            }}
                            variant='subtle'
                            bg={'rgba(0, 0, 0, 0.5)'}
                            color='white'
                            pos={'absolute'}
                            top={10}
                            right={10}
                            className='z-[10]'
                          >
                            <IconTrash size={24} />
                          </ActionIcon>
                        </Tooltip>
                      )}
                    </Box>
                  </Carousel.Slide>
                ))}
              </Carousel>
            ) : (
              <Paper radius={'md'} className='relative h-[400px] overflow-hidden hover:bg-[rgba(0,0,0,0.1)]' withBorder>
                <label htmlFor='gallery' className='cursor-pointer'>
                  <Flex w={'100%'} h={'100%'} align={'center'} justify={'center'} direction={'column'} gap={10}>
                    <IconPlus size={20} />
                    <Text>Thêm ảnh</Text>
                  </Flex>
                </label>
              </Paper>
            )}
          </Box>

          <Flex direction='column' align='center' justify='space-between' w={{ base: '100%', lg: '33.333333%' }}>
            <Paper
              w={'100%'}
              h={190}
              radius={'md'}
              className='relative h-[400px] overflow-hidden hover:bg-[rgba(0,0,0,0.1)]'
              withBorder
            >
              {banner1 ? (
                <>
                  <Image
                    src={banner1 && banner1 instanceof File ? URL.createObjectURL(banner1 as unknown as File) : banner1}
                    w={'100%'}
                    h='100%'
                  />
                  {setValue && (
                    <Tooltip label={'Xóa'} withArrow>
                      <ActionIcon
                        onClick={() => {
                          setValue('banner1', null);
                        }}
                        variant='subtle'
                        bg={'rgba(0, 0, 0, 0.9)'}
                        color='white'
                        pos={'absolute'}
                        top={10}
                        right={10}
                        className='z-[10]'
                      >
                        <IconTrash size={24} />
                      </ActionIcon>
                    </Tooltip>
                  )}
                </>
              ) : (
                <label htmlFor='banner1' className='h-[190px] w-full cursor-pointer'>
                  <Flex w={'100%'} h={'100%'} align={'center'} justify={'center'} direction={'column'} gap={10}>
                    <IconPlus size={20} />
                    <Text>Thêm ảnh</Text>
                  </Flex>
                </label>
              )}
            </Paper>

            <Paper
              w={'100%'}
              h={190}
              radius={'md'}
              className='relative h-[400px] overflow-hidden hover:bg-[rgba(0,0,0,0.1)]'
              withBorder
            >
              {banner2 ? (
                <>
                  <Image
                    src={banner2 && banner2 instanceof File ? URL.createObjectURL(banner2 as unknown as File) : banner2}
                    w={'100%'}
                    h='100%'
                  />
                  {setValue && (
                    <Tooltip label={'Xóa'} withArrow>
                      <ActionIcon
                        onClick={() => {
                          setValue('banner2', null);
                        }}
                        variant='subtle'
                        color='white'
                        bg={'rgba(0, 0, 0, 0.9)'}
                        pos={'absolute'}
                        top={10}
                        right={10}
                        className='z-[10]'
                      >
                        <IconTrash size={24} />
                      </ActionIcon>
                    </Tooltip>
                  )}
                </>
              ) : (
                <label htmlFor='banner2' className='h-[190px] w-full cursor-pointer'>
                  <Flex w={'100%'} h={'100%'} align={'center'} justify={'center'} direction={'column'} gap={10}>
                    <IconPlus size={20} />
                    <Text>Thêm ảnh</Text>
                  </Flex>
                </label>
              )}
            </Paper>
          </Flex>
        </Flex>
      </Stack>
    </>
  );
};
