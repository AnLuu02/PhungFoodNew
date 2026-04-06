'use client';

import { ActionIcon, Badge, Box, Button, Card, Checkbox, Group, Image, Text, Tooltip, Transition } from '@mantine/core';
import { useHover } from '@mantine/hooks';
import { IconAlertCircle, IconDotsVertical, IconLinkOff, IconPencil, IconPointFilled } from '@tabler/icons-react';

interface ImageCardProps {
  image: any;
  mode?: 'library' | 'page';
  imageIdConnected?: string;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onConnected?: (imageId: string, mode?: 'connect' | 'disconnect') => void;
}

export function ImageCard({
  image,
  imageIdConnected,
  isSelected,
  onSelect,
  mode,
  onEdit,
  onConnected
}: ImageCardProps) {
  const { hovered, ref } = useHover();
  const isConnected = imageIdConnected && imageIdConnected === image?.id;
  return (
    <>
      <Card
        withBorder
        ref={ref}
        padding={0}
        radius='xl'
        className={`group relative border-2 transition-all duration-300 hover:-translate-y-1 ${
          isSelected ? 'border-blue-500 shadow-lg' : 'border-transparent bg-white shadow-sm'
        } `}
      >
        <div
          className={`absolute right-4 top-4 z-30 transition-opacity duration-200 ${
            isSelected || hovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Checkbox
            checked={isSelected}
            onChange={onSelect}
            radius='sm'
            styles={{ input: { cursor: 'pointer', width: 20, height: 20 } }}
          />
        </div>

        {/* Thumbnail Section */}
        <Card.Section className='relative aspect-[4/3] overflow-hidden bg-gray-100'>
          <Image
            src={image.url}
            alt={image.altText || 'Untitled'}
            className={`h-full w-full object-cover transition-all duration-700 ${
              hovered ? 'scale-110 grayscale-0' : image.isOrphaned ? 'opacity-80 grayscale' : 'scale-100'
            }`}
          />
          {mode && mode === 'library' ? (
            <div
              className={`absolute bottom-4 right-4 z-30 transition-opacity duration-200 ${
                hovered ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <Button
                radius='xl'
                size='xs'
                variant={isConnected ? 'light' : 'filled'}
                color={isConnected ? 'gray' : 'blue'}
                leftSection={<IconPointFilled size={10} />}
                onClick={e => {
                  e.stopPropagation();
                  image?.id && onConnected?.(image?.id, isConnected ? 'disconnect' : 'connect');
                }}
              >
                {isConnected ? 'Ngắt' : 'Kết nối'}
              </Button>
            </div>
          ) : null}

          {/* Status Badge & Unused Indicator */}
          <div className='absolute left-4 top-4 z-10 flex flex-col gap-2'>
            {!image.isOrphaned ? (
              <Badge variant='filled' className='h-6 rounded-full bg-blue-600 px-3 text-[10px] font-black shadow-lg'>
                {image.usageCount} đã liên kết
              </Badge>
            ) : (
              <Badge
                variant='filled'
                color='gray'
                leftSection={<IconLinkOff size={10} stroke={3} />}
                className='h-6 rounded-full bg-gray-800 px-3 text-[10px] font-black text-white shadow-lg'
              >
                Chưa có liên kết
              </Badge>
            )}
          </div>

          {/* Hover Overlay Actions */}
          <Transition mounted={hovered && !isSelected} transition='fade' duration={200}>
            {styles => (
              <div
                style={styles}
                className='absolute inset-0 z-20 flex items-center justify-center gap-3 bg-black/40 backdrop-blur-[2px]'
              >
                <ActionIcon
                  variant='white'
                  size={42}
                  radius='xl'
                  onClick={onEdit}
                  className='text-gray-900 shadow-xl transition-all hover:bg-blue-600 hover:text-white'
                >
                  <IconPencil size={20} />
                </ActionIcon>
              </div>
            )}
          </Transition>
        </Card.Section>

        {/* Content Section */}
        <div className={`p-5 ${image.isOrphaned ? 'bg-yellow-50' : ''}`}>
          <Group justify='space-between' wrap='nowrap' align='flex-start'>
            <Box className='flex-1'>
              <Tooltip label={image.altText || 'Chưa có mô tả.'}>
                <Text
                  className={`line-clamp-1 text-base font-bold transition-colors duration-300 ${
                    hovered ? 'text-blue-600' : 'text-gray-900'
                  }`}
                >
                  {image.altText || 'Chưa có mô tả.'}
                </Text>
              </Tooltip>

              <Group gap={6} mt={4}>
                <Text size='xs' className='font-medium text-gray-400'>
                  {image.width ? `${image.width} × ${image.height} • ${image?.format?.toUpperCase()}` : 'Đang cập nhật'}
                </Text>
                {image.isOrphaned && (
                  <Tooltip label='Ảnh này chưa được sử dụng trong dự án nào'>
                    <IconAlertCircle size={14} className='text-amber-500' stroke={2.5} />
                  </Tooltip>
                )}
              </Group>
            </Box>

            <ActionIcon variant='subtle' color='gray' radius='xl' className='hover:bg-gray-100'>
              <IconDotsVertical size={18} />
            </ActionIcon>
          </Group>
        </div>
      </Card>

      {/* <Card
        withBorder
        p={0}
        radius='md'
        onClick={onViewDetail}
        style={{
          cursor: 'pointer',
          border: isSelected ? '2px solid var(--mantine-color-blue-6)' : undefined,
          opacity: image.isOrphaned ? 0.7 : 1
        }}
      >
        <Card.Section>
          <Box style={{ position: 'relative' }}>
            <Image src={image.url} alt={image.altText || 'Untitled'} height={200} style={{ objectFit: 'cover' }} />
            <Box
              style={{
                position: 'absolute',
                top: 20,
                right: 20,
                backgroundColor: 'rgba(0,0,0,0.5)',
                borderRadius: '4px'
              }}
            >
              <Checkbox checked={isSelected} onChange={onSelect} onClick={e => e.stopPropagation()} />
            </Box>
          </Box>
        </Card.Section>

        <Stack p='xs' gap='xs'>
          <Group justify='space-between' gap='xs'>
            <Badge size='sm' variant='light'>
              {image.type}
            </Badge>
            {image.isOrphaned && (
              <Badge color='yellow' size='sm'>
                Ảnh chưa sử dụng
              </Badge>
            )}
          </Group>

          <Text size='xs' lineClamp={1} fw={500}>
            {image.altText || 'No description'}
          </Text>

          {image.associations.length > 0 && (
            <Badge size='xs' variant='dot' color='green'>
              {image.usageCount} được liên kết
            </Badge>
          )}

          <Text size='xs' c='dimmed'>
            {image.width} × {image.height}
          </Text>
        </Stack>
      </Card> */}
    </>
  );
}
