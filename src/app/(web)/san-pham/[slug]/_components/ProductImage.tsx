'use client';

import { Box, Flex, Image, Modal, Paper, Text } from '@mantine/core';
import { useState } from 'react';
import { formatPriceLocaleVi } from '~/app/lib/utils/format/formatPrice';
import { SocialShare } from './SocialShare';

interface ProductImageProps {
  mainImage: string;
  thumbnails: string[];
  discount?: number;
}

export function ProductImage({ mainImage, thumbnails, discount }: ProductImageProps) {
  const [currentImage, setCurrentImage] = useState(mainImage);
  const [showfullImage, setShowfullImage] = useState(false);

  return (
    <>
      <Flex align={'flex-start'} gap={'xs'} justify={'flex-start'} pos={'relative'} w={'100%'}>
        <Flex direction={'column'} gap={'xs'} justify='space-between' align='center' top={0} left={0}>
          {thumbnails?.map((item, index) => (
            <Paper
              w={113}
              h={113}
              withBorder
              key={index}
              radius={'md'}
              onClick={() => {
                setCurrentImage(item);
                setShowfullImage(true);
              }}
              className='border-5 cursor-pointer overflow-hidden border-[#008b4b]'
            >
              <Image loading='lazy' src={item} w={113} h={113} />
            </Paper>
          ))}
        </Flex>
        <Paper radius='md' className='relative mb-4' w={'100%'}>
          <Flex direction={'column'} align={'center'} justify={'center'} w={'100%'}>
            <Image
              loading='lazy'
              src={mainImage}
              alt='Product'
              className='object-cover'
              radius={'md'}
              w={'100%'}
              h={'100%'}
            />
            <Box mt={'md'}>
              <SocialShare />
            </Box>
          </Flex>
        </Paper>
        {discount && discount > 0 ? (
          <Flex
            className='rounded-b-full'
            pos={'absolute'}
            top={0}
            right={20}
            align={'center'}
            gap={4}
            direction={'column'}
            bg={'red'}
            px={'xs'}
            py={'md'}
          >
            <Text size='xs' fw={700} c={'white'}>
              -{formatPriceLocaleVi(discount)}
            </Text>
            <Text size='xs' fw={700} c={'white'}>
              OFF
            </Text>
          </Flex>
        ) : null}
      </Flex>
      <Modal size={'xl'} opened={showfullImage} onClose={() => setShowfullImage(false)}>
        <Image loading='lazy' src={currentImage} />
      </Modal>
    </>
  );
}
