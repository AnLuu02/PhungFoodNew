'use client';

import { Box, Flex, Paper, Text } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import Image from 'next/image';
import { memo, useState } from 'react';
import { ImageZoomModal } from '~/components/Modals/ModalZoomImage';
import { ShareSocials } from '~/components/ShareSocial';
import { breakpoints } from '~/constants';
import { formatPriceLocaleVi } from '~/lib/FuncHandler/Format';
export default memo(function ProductImage({
  thumbnail,
  gallery,
  discount,
  tag
}: {
  thumbnail: string;
  gallery: string[];
  discount?: number;
  tag: string;
}) {
  const isDesktop = useMediaQuery(`(min-width: ${breakpoints.md}px)`);

  const [currentImage, setCurrentImage] = useState(thumbnail);
  const [showFullImage, setShowFullImage] = useState(false);

  const imageLimit = isDesktop ? 4 : 3;

  const displayImages = gallery.slice(0, imageLimit - 1);

  const remainingCount = Math.max(gallery.length - (imageLimit - 1), 0);

  const handleThumbnailClick = (image: string) => {
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
        {displayImages?.length > 0 && (
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
                pos={'relative'}
                key={index}
                onClick={() => handleThumbnailClick(item)}
                className={`cursor-pointer overflow-hidden ${item === currentImage ? 'border-2 border-mainColor' : ''}`}
              >
                <Image
                  loading='lazy'
                  src={item || '/images/jpg/empty-300x240.jpg'}
                  fill
                  className='object-cover'
                  alt='Thumbnail'
                />
              </Paper>
            ))}
            {remainingCount > 0 && (
              <Paper
                onClick={() => handleThumbnailClick(currentImage)}
                w={110}
                h={110}
                pos={'relative'}
                withBorder
                className={`cursor-pointer overflow-hidden`}
              >
                <Image
                  loading='lazy'
                  src={currentImage || '/images/jpg/empty-300x240.jpg'}
                  fill
                  className='object-cover'
                  alt='Thumbnail'
                />
                <Paper
                  p={0}
                  m={0}
                  className='absolute left-0 top-0 flex h-full w-full cursor-pointer items-center justify-center bg-black/50 text-2xl font-bold text-white backdrop-blur-md'
                >
                  +{remainingCount}
                </Paper>
              </Paper>
            )}
          </Flex>
        )}

        <Paper className='relative mb-4' w='100%'>
          <Flex direction='column' align='center' justify='center' w='100%'>
            <Paper pos={'relative'} w={'100%'} mih={{ base: 300, md: 470 }} className='overflow-hidden'>
              <Image
                loading='lazy'
                src={thumbnail || currentImage}
                alt='Product'
                className='cursor-pointer object-cover'
                fill
                onClick={() => setShowFullImage(true)}
              />
            </Paper>
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
        gallery={[thumbnail, ...gallery].map(item => ({
          src: item,
          alt: 'Ảnh mô tả sản phẩm'
        }))}
        isOpen={showFullImage}
        onClose={() => setShowFullImage(false)}
      />
    </>
  );
});
