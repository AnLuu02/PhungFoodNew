'use client';

import { Box, Flex, Paper, Text } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import Image from 'next/image';
import { useState } from 'react';
import { ImageZoomModal } from '~/components/Modals/ModalZoomImage';
import ShareSocials from '~/components/ShareSocial';
import { formatPriceLocaleVi } from '~/lib/func-handler/Format';
export default function ProductImage({
  thumbnail,
  gallery,
  discount,
  tag
}: {
  thumbnail: string;
  gallery: { url: string }[];
  discount?: number;
  tag: string;
}) {
  const isDesktop = useMediaQuery(`(min-width:1024px)`);
  const [currentImage, setCurrentImage] = useState(thumbnail);
  const [showFullImage, setShowFullImage] = useState(false);
  const allImages = [{ url: thumbnail }, ...gallery];
  const displayImages = allImages.slice(1, !isDesktop ? 3 : 4);
  const remainingCount = allImages.length > (!isDesktop ? 3 : 4) ? allImages.length - (!isDesktop ? 3 : 4) : 0;

  const handleThumbnailClick = (image: string, index: number) => {
    setCurrentImage(image);
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
              className={`cursor-pointer overflow-hidden ${
                item.url === currentImage ? 'border-2 border-mainColor' : ''
              }`}
            >
              <Box pos='relative'>
                <Image
                  loading='lazy'
                  src={item.url || '/images/jpg/empty-300x240.jpg'}
                  width={110}
                  height={110}
                  className='object-cover'
                  alt='Thumbnail'
                />
              </Box>
            </Paper>
          ))}
          {remainingCount > 0 && (
            <Paper
              onClick={() => handleThumbnailClick(currentImage, remainingCount - 1)}
              w={110}
              h={110}
              withBorder
              radius='md'
              className={`cursor-pointer overflow-hidden`}
            >
              <Box pos='relative'>
                <Image
                  loading='lazy'
                  src={currentImage || '/images/jpg/empty-300x240.jpg'}
                  width={110}
                  height={110}
                  className='object-cover'
                  alt='Thumbnail'
                />
                <Box className='absolute left-0 top-0 flex h-full w-full cursor-pointer items-center justify-center rounded-md bg-black/50 text-2xl font-bold text-white backdrop-blur-md'>
                  +{remainingCount}
                </Box>
              </Box>
            </Paper>
          )}
        </Flex>

        <Paper radius='md' className='relative mb-4' w='100%'>
          <Flex direction='column' align='center' justify='center' w='100%'>
            <Box pos={'relative'} w={'100%'} mih={{ base: 300, md: 470 }} className='overflow-hidden'>
              <Image
                loading='lazy'
                src={thumbnail || currentImage}
                alt='Product'
                className='cursor-pointer rounded-md object-cover'
                fill
                onClick={() => setShowFullImage(true)}
              />
            </Box>
            <Box mt='md'>
              <ShareSocials data={{ tag }} />
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
            <Text size='xs' fw={700} className='text-white'>
              -{formatPriceLocaleVi(discount)}
            </Text>
            <Text size='xs' fw={700} className='text-white'>
              OFF
            </Text>
          </Flex>
        ) : null}
      </Flex>
      <ImageZoomModal
        activeImage={{
          src: currentImage,
          alt: 'Ảnh chính sản phẩm'
        }}
        gallery={[{ url: thumbnail }, ...gallery].map(item => ({
          src: item.url,
          alt: 'Ảnh mô tả sản phẩm'
        }))}
        isOpen={showFullImage}
        onClose={() => setShowFullImage(false)}
      />
    </>
  );
}
