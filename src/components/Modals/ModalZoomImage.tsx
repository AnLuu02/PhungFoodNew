'use client';

import { ActionIcon, Box, Button, Flex, Image, Modal, Paper, Text, UnstyledButton } from '@mantine/core';
import {
  IconChevronCompactLeft,
  IconChevronCompactRight,
  IconHandMove,
  IconRotateClockwise,
  IconX,
  IconZoomIn,
  IconZoomOut
} from '@tabler/icons-react';
import type React from 'react';

import { TouchList, useEffect, useRef, useState } from 'react';

interface ImageType {
  src: string;
  alt: string;
}
interface ImageZoomModalProps {
  activeImage: ImageType;
  gallery: ImageType[];
  isOpen: boolean;
  onClose: () => void;
}

export function ImageZoomModal({ activeImage, gallery, isOpen, onClose }: ImageZoomModalProps) {
  const [currentImage, setCurrentImage] = useState<{ alt: string; src: string }>();
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);
  useEffect(() => {
    if (isOpen) {
      const index = gallery.findIndex(image => image.src === activeImage.src);
      setScale(1);
      setPosition({ x: 0, y: 0 });
      setCurrentImage({
        alt: activeImage.alt,
        src: activeImage.src
      });
      setIndex(index);
    }
  }, [isOpen]);

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev * 1.5, 5));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev / 1.5, 0.5));
  };

  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setScale(prev => Math.min(Math.max(prev * delta, 0.5), 5));
  };

  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [initialDistance, setInitialDistance] = useState<number | null>(null);
  const [initialScale, setInitialScale] = useState(1);

  const getTouchDistance = (touches: TouchList) => {
    const touch1 = touches[0];
    const touch2 = touches[1];
    if (!touch1 || !touch2) return 0;
    return Math.sqrt(Math.pow(touch2.clientX - touch1.clientX, 2) + Math.pow(touch2.clientY - touch1.clientY, 2));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      if (e.touches[0]) {
        setTouchStart({
          x: e.touches[0].clientX - position.x,
          y: e.touches[0].clientY - position.y
        });
      }
    } else if (e.touches.length === 2) {
      setInitialDistance(getTouchDistance(e.touches));
      setInitialScale(scale);
      setTouchStart(null);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();

    if (
      e.touches.length === 1 &&
      touchStart !== null &&
      typeof touchStart.x === 'number' &&
      typeof touchStart.y === 'number' &&
      scale > 1
    ) {
      if (touchStart !== null && typeof touchStart.x === 'number' && typeof touchStart.y === 'number') {
        setPosition({
          x: (e.touches[0]?.clientX ?? 0) - touchStart.x,
          y: (e.touches[0]?.clientY ?? 0) - touchStart.y
        });
      }
    } else if (e.touches.length === 2 && initialDistance) {
      const currentDistance = getTouchDistance(e.touches);
      const scaleChange = currentDistance / initialDistance;
      setScale(Math.min(Math.max(initialScale * scaleChange, 0.5), 5));
    }
  };

  const handleTouchEnd = () => {
    setTouchStart(null);
    setInitialDistance(null);
  };

  //sáas
  const [index, setIndex] = useState(0);
  const totalImages = gallery;
  const displayImages = totalImages.slice(0, 4);
  const remainingCount = totalImages.length > 4 ? totalImages.length - 4 : 0;
  const handleThumbnailClick = (image: ImageType, index: number) => {
    setCurrentImage(image);
    setIndex(index);
  };

  const handleNext = (index: number) => {
    if (index < totalImages.length - 1) {
      setIndex(index + 1);
      setCurrentImage(totalImages[index + 1]);
    }
  };
  const handlePrev = (index: number) => {
    if (index > 0) {
      setIndex(index - 1);
      setCurrentImage(totalImages[index - 1]);
    }
  };
  return (
    <Modal
      opened={isOpen}
      onClose={() => {
        onClose();
        handleReset();
        setIndex(0);
      }}
      size={'100%'}
      radius={'lg'}
      withCloseButton={false}
      padding={0}
      className='overflow-hidden'
    >
      <Box className='h-[90vh] overflow-hidden border-0 bg-black/95 p-0' pos={'relative'}>
        <ActionIcon
          disabled={index === 0 || totalImages.length === 1}
          onClick={() => handlePrev(index)}
          size='xl'
          radius='xl'
          className='absolute left-6 top-[50%] z-50 bg-mainColor duration-200 hover:bg-subColor disabled:bg-gray-50'
        >
          <IconChevronCompactLeft className='h-5 w-5' />
        </ActionIcon>
        <ActionIcon
          disabled={index === totalImages.length - 1 || totalImages.length === 1}
          onClick={() => handleNext(index)}
          size='xl'
          radius='xl'
          className='absolute right-6 top-[50%] z-50 bg-mainColor duration-200 hover:bg-subColor disabled:bg-gray-50'
        >
          <IconChevronCompactRight className='h-5 w-5' />
        </ActionIcon>

        <Button
          size='icon'
          className='absolute right-4 top-4 z-50 border border-white/20 bg-black/50 text-white hover:bg-black/70'
          onClick={onClose}
        >
          <IconX className='h-5 w-5' />
        </Button>

        <Box className='absolute left-4 top-4 z-50 flex flex-col gap-2'>
          <Button
            size='icon'
            className='border border-white/20 bg-black/50 text-white hover:bg-black/70'
            onClick={handleZoomIn}
            disabled={scale >= 5}
          >
            <IconZoomIn className='h-5 w-5' />
          </Button>
          <Button
            size='icon'
            className='border border-white/20 bg-black/50 text-white hover:bg-black/70'
            onClick={handleZoomOut}
            disabled={scale <= 0.5}
          >
            <IconZoomOut className='h-5 w-5' />
          </Button>
          <Button
            size='icon'
            className='border border-white/20 bg-black/50 text-white hover:bg-black/70'
            onClick={handleReset}
          >
            <IconRotateClockwise className='h-5 w-5' />
          </Button>
        </Box>

        <Box className='absolute bottom-28 left-[50%] z-50 translate-x-[-50%] rounded-md border border-white/20 bg-black/50 px-3 py-2 text-white sm:bottom-4 sm:left-4 sm:translate-x-0'>
          <Text size='sm'>{Math.round(scale * 100)}%</Text>
        </Box>

        {scale > 1 && (
          <Box className='absolute right-4 top-16 z-50 flex items-center gap-2 rounded-lg border border-white/20 bg-black/50 px-3 py-2 text-white'>
            <IconHandMove className='h-4 w-4' />
            <Text size='sm'>Kéo để di chuyển</Text>
          </Box>
        )}

        <Box className='absolute bottom-4 right-4 z-50 flex items-center gap-2'>
          <Flex gap='xs' p='md' wrap='wrap' justify='center'>
            {displayImages.map((item, index) => {
              return (
                <UnstyledButton
                  key={index}
                  onClick={() => handleThumbnailClick(item, index)}
                  className={`overflow-hidden rounded-[4px] transition duration-200 ${
                    item.src === currentImage?.src
                      ? 'border-2 border-solid border-mainColor opacity-100'
                      : 'border-none opacity-60'
                  } `}
                >
                  <Image
                    loading='lazy'
                    src={item.src || '/images/jpg/empty-300x240.jpg'}
                    w={60}
                    h={60}
                    alt={item.alt}
                    className='rounded-md object-cover'
                  />
                </UnstyledButton>
              );
            })}
            {totalImages.length > displayImages.length && (
              <Paper
                w={60}
                h={60}
                withBorder
                radius='md'
                onClick={() =>
                  handleThumbnailClick(totalImages[displayImages.length] as ImageType, displayImages.length)
                }
                p={0}
                className={`cursor-pointer overflow-hidden ${
                  index >= displayImages.length
                    ? 'border-2 border-solid border-mainColor opacity-100'
                    : 'border-none opacity-60'
                } `}
              >
                <Box pos='relative'>
                  <Image
                    loading='lazy'
                    src={totalImages[index]?.src || '/images/jpg/empty-300x240.jpg'}
                    width={60}
                    height={60}
                    className='rounded-md object-cover'
                    alt='Thumbnail'
                  />
                  <Box
                    className={`absolute left-0 top-0 flex h-full w-full cursor-pointer items-center justify-center rounded-md bg-black/50 text-2xl font-bold text-white backdrop-blur-md`}
                  >
                    +{remainingCount}
                  </Box>
                </Box>
              </Paper>
            )}
          </Flex>
        </Box>

        <Box
          className='flex h-[95vh] w-full cursor-grab items-center justify-center overflow-hidden active:cursor-grabbing'
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <Image
            ref={imageRef}
            src={currentImage?.src || '/placeholder.svg'}
            alt={currentImage?.alt || 'zoom image'}
            className='max-h-none max-w-none select-none object-contain transition-transform duration-200 ease-out'
            style={{
              transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
              cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'
            }}
            draggable={false}
          />
        </Box>

        <Box className='absolute bottom-4 left-1/2 z-50 hidden -translate-x-1/2 transform rounded-lg border border-white/20 bg-black/50 px-4 py-2 text-white xl:block'>
          <Box className='space-y-1 text-center text-xs'>
            <Box>Cuộn chuột để zoom • Kéo để di chuyển</Box>
            <Box className='text-white/70'>ESC để đóng</Box>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}
