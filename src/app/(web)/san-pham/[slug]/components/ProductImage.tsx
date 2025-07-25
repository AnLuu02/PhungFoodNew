'use client';

import { Carousel } from '@mantine/carousel';
import { ActionIcon, Box, Flex, Group, Modal, Paper, Text, UnstyledButton } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import {
  IconBrandFacebook,
  IconBrandPinterest,
  IconBrandTwitter,
  IconChevronLeft,
  IconChevronRight
} from '@tabler/icons-react';
import clsx from 'clsx';
import Image from 'next/image';
import { useState } from 'react';
import { formatPriceLocaleVi } from '~/lib/func-handler/formatPrice';

export default function ProductImage({
  thumbnail,
  gallery,
  discount
}: {
  thumbnail: string;
  gallery: { url: string }[];
  discount?: number;
}) {
  const isDesktop = useMediaQuery(`(min-width:1024px)`);
  const [currentImage, setCurrentImage] = useState(thumbnail);
  const [showFullImage, setShowFullImage] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  const allImages = [{ url: thumbnail }, ...gallery];
  const displayImages = allImages.slice(0, !isDesktop ? 3 : 4);
  const remainingCount = allImages.length > (!isDesktop ? 3 : 4) ? allImages.length - (!isDesktop ? 3 : 4) : 0;

  const handleThumbnailClick = (image: string, index: number) => {
    setCurrentImage(image);
    setActiveSlide(index);
    setShowFullImage(true);
  };

  return (
    <>
      <Flex
        direction={{ base: 'column-reverse', sm: 'column-reverse', md: 'column-reverse', lg: 'row' }}
        align='flex-start'
        gap='xs'
        justify='flex-start'
        pos='relative'
        w='100%'
      >
        <Flex
          w={{ base: '100%', sm: 'max-content', md: 'max-content', lg: 'max-content' }}
          direction={{ base: 'row', sm: 'row', md: 'row', lg: 'column' }}
          gap='xs'
          justify='space-between'
          align='center'
          top={0}
          left={0}
        >
          {displayImages.map((item, index) => (
            <Paper
              w={110}
              h={110}
              withBorder
              key={index}
              radius='md'
              onClick={() => handleThumbnailClick(item.url, index)}
              className={clsx(
                'cursor-pointer overflow-hidden',
                item.url === currentImage && 'border-2 border-mainColor'
              )}
            >
              {index === (!isDesktop ? 2 : 3) && remainingCount > 0 ? (
                <Box pos='relative'>
                  <Image
                    loading='lazy'
                    src={item.url || '/images/jpg/empty-300x240.jpg'}
                    width={110}
                    height={110}
                    style={{ objectFit: 'cover' }}
                    alt='Thumbnail'
                  />
                  <Box className='absolute left-0 top-0 flex h-full w-full cursor-pointer items-center justify-center rounded-md bg-black/50 text-2xl font-bold text-white backdrop-blur-md'>
                    +{remainingCount}
                  </Box>
                </Box>
              ) : (
                <Image
                  loading='lazy'
                  src={item.url || '/images/jpg/empty-300x240.jpg'}
                  width={110}
                  style={{ objectFit: 'cover' }}
                  height={110}
                  alt='Thumbnail'
                />
              )}
            </Paper>
          ))}
        </Flex>

        <Paper radius='md' className='relative mb-4' w='100%'>
          <Flex direction='column' align='center' justify='center' w='100%'>
            <Box pos={'relative'} w={'100%'} mih={{ base: 300, md: 470 }} className='overflow-hidden'>
              <Image
                loading='lazy'
                src={currentImage || thumbnail}
                alt='Product'
                className='cursor-pointer rounded-md object-cover'
                style={{ objectFit: 'cover' }}
                fill
                onClick={() => setShowFullImage(true)}
              />
            </Box>
            <Box mt='md'>
              <Group gap='xs'>
                <Text size='md' fw={700}>
                  Chia sẻ
                </Text>
                <ActionIcon color='blue' radius='xl' size={'lg'}>
                  <IconBrandFacebook />
                </ActionIcon>
                <ActionIcon color='red' radius='xl' size={'lg'}>
                  <IconBrandPinterest />
                </ActionIcon>
                <ActionIcon color='blue' radius='xl' size={'lg'}>
                  <IconBrandTwitter />
                </ActionIcon>
              </Group>
            </Box>
          </Flex>
        </Paper>

        {discount && discount > 0 ? (
          <Flex
            className='rounded-b-full'
            pos='absolute'
            top={0}
            right={20}
            align='center'
            gap={4}
            direction='column'
            bg='red'
            px='xs'
            py='md'
          >
            <Text size='xs' fw={700} c='white'>
              -{formatPriceLocaleVi(discount)}
            </Text>
            <Text size='xs' fw={700} c='white'>
              OFF
            </Text>
          </Flex>
        ) : null}
      </Flex>

      <Modal
        size='xl'
        opened={showFullImage}
        onClose={() => setShowFullImage(false)}
        centered
        padding={0}
        className='overflow-hidden'
      >
        <Carousel
          loop
          withControls
          initialSlide={activeSlide}
          onSlideChange={index => setActiveSlide(index)}
          nextControlIcon={<IconChevronRight size={30} />}
          nextControlProps={{ style: { backgroundColor: 'gray', color: 'white' } }}
          previousControlProps={{ style: { backgroundColor: 'gray', color: 'white' } }}
          previousControlIcon={<IconChevronLeft size={30} />}
          styles={{
            control: {
              '&[data-inactive]': {
                opacity: 0,
                cursor: 'default'
              }
            }
          }}
        >
          {allImages.map((item, index) => (
            <Carousel.Slide key={index}>
              <Flex align='center' justify='center' h={{ base: 300, md: 400 }} w={{ base: 300, md: 600 }}>
                <Image
                  loading='lazy'
                  src={item.url || '/images/jpg/empty-300x240.jpg'}
                  style={{ objectFit: 'contain' }}
                  className='object-contain'
                  fill
                  alt='Product Image'
                />
              </Flex>
            </Carousel.Slide>
          ))}
        </Carousel>

        <Flex gap='xs' p='md' wrap='wrap' justify='center'>
          {allImages.map((item, index) => (
            <UnstyledButton
              key={index}
              onClick={() => setActiveSlide(index)}
              className={clsx(
                'overflow-hidden rounded-[4px] transition duration-200',
                activeSlide === index ? 'border-2 border-mainColor opacity-100' : 'border-none opacity-60'
              )}
            >
              <Image
                loading='lazy'
                src={item.url || '/images/jpg/empty-300x240.jpg'}
                width={60}
                height={60}
                alt=''
                style={{ objectFit: 'cover' }}
              />
            </UnstyledButton>
          ))}
        </Flex>
      </Modal>
    </>
  );
}
