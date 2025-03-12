// 'use client';

// import { Box, Flex, Image, Modal, Paper, Text } from '@mantine/core';
// import { useState } from 'react';
// import { formatPriceLocaleVi } from '~/app/lib/utils/format/formatPrice';
// import { SocialShare } from './SocialShare';

// interface ProductImageProps {
//   thumbnail: string;
//   gallery: string[];
//   discount?: number;
// }

// export function ProductImage({ thumbnail, gallery, discount }: ProductImageProps) {
//   const [currentImage, setCurrentImage] = useState(thumbnail);
//   const [showfullImage, setShowfullImage] = useState(false);

//   return (
//     <>
//       <Flex align={'flex-start'} gap={'xs'} justify={'flex-start'} pos={'relative'} w={'100%'}>
//         <Flex direction={'column'} gap={'xs'} justify='space-between' align='center' top={0} left={0}>
//           {gallery?.length > 0 &&
//             gallery?.map((item: any, index) => (
//               <Paper
//                 w={113}
//                 h={113}
//                 withBorder
//                 key={index}
//                 radius={'md'}
//                 onClick={() => {
//                   setCurrentImage(item?.url);
//                   setShowfullImage(true);
//                 }}
//                 className='border-5 cursor-pointer overflow-hidden border-[#008b4b]'
//               >
//                 <Image loading='lazy' src={item?.url || '/images/jpg/empty-300x240.jpg'} w={113} h={113} />
//               </Paper>
//             ))}
//         </Flex>
//         <Paper radius='md' className='relative mb-4' w={'100%'}>
//           <Flex direction={'column'} align={'center'} justify={'center'} w={'100%'}>
//             <Image
//               loading='lazy'
//               src={thumbnail}
//               alt='Product'
//               className='object-cover'
//               radius={'md'}
//               w={'100%'}
//               h={'100%'}
//             />
//             <Box mt={'md'}>
//               <SocialShare />
//             </Box>
//           </Flex>
//         </Paper>
//         {discount && discount > 0 ? (
//           <Flex
//             className='rounded-b-full'
//             pos={'absolute'}
//             top={0}
//             right={20}
//             align={'center'}
//             gap={4}
//             direction={'column'}
//             bg={'red'}
//             px={'xs'}
//             py={'md'}
//           >
//             <Text size='xs' fw={700} c={'white'}>
//               -{formatPriceLocaleVi(discount)}
//             </Text>
//             <Text size='xs' fw={700} c={'white'}>
//               OFF
//             </Text>
//           </Flex>
//         ) : null}
//       </Flex>
//       <Modal size={'xl'} opened={showfullImage} onClose={() => setShowfullImage(false)} centered>
//         <Image loading='lazy' src={currentImage} fit='contain' h={500} />
//       </Modal>
//     </>
//   );
// }

'use client';

import { Carousel } from '@mantine/carousel';
import { Box, Flex, Image, Modal, Paper, Text, UnstyledButton } from '@mantine/core';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import clsx from 'clsx';
import { useState } from 'react';
import { formatPriceLocaleVi } from '~/app/lib/utils/format/formatPrice';
import { SocialShare } from './SocialShare';

interface ProductImageProps {
  thumbnail: string;
  gallery: { url: string }[];
  discount?: number;
}

export function ProductImage({ thumbnail, gallery, discount }: ProductImageProps) {
  const [currentImage, setCurrentImage] = useState(thumbnail);
  const [showFullImage, setShowFullImage] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  // Prepare gallery data
  const allImages = [{ url: thumbnail }, ...gallery];
  const displayImages = allImages.slice(0, 4);
  const remainingCount = allImages.length > 4 ? allImages.length - 4 : 0;

  const handleThumbnailClick = (image: string, index: number) => {
    setCurrentImage(image);
    setActiveSlide(index);
    setShowFullImage(true);
  };

  return (
    <>
      <Flex align='flex-start' gap='xs' justify='flex-start' pos='relative' w='100%'>
        <Flex direction='column' gap='xs' justify='space-between' align='center' top={0} left={0}>
          {displayImages.map((item, index) => (
            <Paper
              w={113}
              h={113}
              withBorder
              key={index}
              radius='md'
              onClick={() => handleThumbnailClick(item.url, index)}
              className={clsx(
                'cursor-pointer overflow-hidden',
                item.url === currentImage && 'border-2 border-[#008b4b]'
              )}
            >
              {index === 3 && remainingCount > 0 ? (
                <Box pos='relative'>
                  <Image loading='lazy' src={item.url || '/images/jpg/empty-300x240.jpg'} w={113} h={113} />
                  <Box className='absolute left-0 top-0 flex h-full w-full cursor-pointer items-center justify-center rounded-md bg-black/50 text-2xl font-bold text-white backdrop-blur-md'>
                    +{remainingCount}
                  </Box>
                </Box>
              ) : (
                <Image loading='lazy' src={item.url || '/images/jpg/empty-300x240.jpg'} w={113} h={113} />
              )}
            </Paper>
          ))}
        </Flex>

        <Paper radius='md' className='relative mb-4' w='100%'>
          <Flex direction='column' align='center' justify='center' w='100%'>
            <Image
              loading='lazy'
              src={currentImage || thumbnail}
              alt='Product'
              className='object-cover'
              radius='md'
              w='100%'
              h='100%'
              onClick={() => setShowFullImage(true)}
              style={{ cursor: 'pointer' }}
            />
            <Box mt='md'>
              <SocialShare />
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
              <Flex align='center' justify='center' h={400}>
                <Image loading='lazy' src={item.url || '/placeholder.svg'} fit='contain' h={400} />
              </Flex>
            </Carousel.Slide>
          ))}
        </Carousel>

        <Flex gap='xs' p='md' wrap='wrap' justify='center'>
          {allImages.map((item, index) => (
            <UnstyledButton
              key={index}
              onClick={() => setActiveSlide(index)}
              style={{
                opacity: activeSlide === index ? 1 : 0.6,
                border: activeSlide === index ? '2px solid #008b4b' : 'none',
                borderRadius: '4px',
                overflow: 'hidden'
              }}
            >
              <Image src={item.url || '/placeholder.svg'} width={60} height={60} fit='cover' />
            </UnstyledButton>
          ))}
        </Flex>
      </Modal>
    </>
  );
}

// Placeholder component for SocialShare
