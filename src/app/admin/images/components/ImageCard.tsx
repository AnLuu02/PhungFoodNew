'use client';

import { ActionIcon, Badge, Box, Card, Checkbox, Group, Image, Text, Tooltip } from '@mantine/core';
import { ImageType } from '@prisma/client';
import { IconAlertCircle, IconDotsVertical, IconLink, IconLinkOff, IconPencil } from '@tabler/icons-react';
import { memo } from 'react';
import { ConnectedState } from './ImageManager';

interface ImageCardProps {
  image: any;
  mode: 'library' | 'page';
  isSelected: boolean;
  linkedPayload: { id?: string; type?: ImageType };
  onSelect: () => void;
  onConnected: ({ mode, opened, imageId }: ConnectedState) => void;
  onEdit: () => void;
}

function ImageCard({ image, isSelected, mode, linkedPayload, onSelect, onConnected, onEdit }: ImageCardProps) {
  const isLinked = Boolean(linkedPayload?.id);
  return (
    <>
      <Card
        withBorder
        padding={0}
        radius='xl'
        className={`group relative border-2 transition-all duration-300 hover:-translate-y-1 ${
          isSelected || isLinked
            ? 'border-mainColor shadow-lg'
            : 'border-transparent bg-white shadow-sm dark:bg-dark-card'
        }`}
      >
        <div
          className={`absolute right-4 top-4 z-30 transition-opacity duration-200 ${
            isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
        >
          <Checkbox
            checked={isSelected}
            onChange={onSelect}
            styles={{ input: { cursor: 'pointer', width: 20, height: 20 } }}
          />
        </div>

        <Card.Section className='relative aspect-[4/3] overflow-hidden bg-gray-100'>
          <Image
            src={image.url}
            alt={image.altText || 'Untitled'}
            className={`h-full w-full object-cover transition-all duration-700 ${
              image.isOrphaned
                ? 'opacity-80 grayscale group-hover:scale-110 group-hover:grayscale-0'
                : 'scale-100 group-hover:scale-110'
            }`}
          />

          <div className='absolute left-4 top-4 z-10 flex flex-col gap-2'>
            {!image.isOrphaned ? (
              <Badge className='h-6 rounded-full bg-mainColor px-3 text-[10px] font-black shadow-lg'>
                {image.usageCount} đã liên kết
              </Badge>
            ) : (
              <Badge
                color='gray'
                leftSection={<IconLinkOff size={10} stroke={3} />}
                className='h-6 rounded-full bg-gray-800 px-3 text-[10px] font-black text-white shadow-lg'
              >
                Chưa có liên kết
              </Badge>
            )}
          </div>

          <div className='absolute right-4 top-4 z-10 flex flex-col gap-2'>
            {isLinked && (
              <Badge
                className={`h-6 rounded-full ${linkedPayload.type === 'THUMBNAIL' ? 'bg-mainColor' : linkedPayload.type === 'GALLERY' ? 'bg-red-600' : 'bg-gray-300'} px-3 text-[10px] font-black shadow-lg`}
              >
                {linkedPayload?.type}
              </Badge>
            )}
          </div>

          <div
            className={`absolute inset-0 z-20 flex items-center justify-center gap-3 bg-black/40 backdrop-blur-[2px] transition-opacity duration-200 ${isSelected ? 'pointer-events-none opacity-0' : 'opacity-0 group-hover:opacity-100'}`}
          >
            <ActionIcon
              variant='white'
              size={42}
              radius='xl'
              onClick={onEdit}
              className='text-gray-900 shadow-xl transition-all hover:bg-mainColor hover:text-white'
            >
              <IconPencil size={20} />
            </ActionIcon>

            {mode === 'library' && (
              <ActionIcon
                variant={isLinked ? 'default' : 'white'}
                color={isLinked ? 'gray' : 'blue'}
                size={42}
                radius='xl'
                onClick={async e => {
                  e.stopPropagation();
                  if (image?.id) {
                    onConnected({
                      opened: true,
                      mode: isLinked ? 'disconnect' : 'connect',
                      imageId: image?.id
                    });
                  }
                }}
                className={`text-gray-900 shadow-xl transition-all hover:bg-mainColor hover:text-white ${
                  isLinked ? 'bg-mainColor text-white' : ''
                }`}
              >
                {isLinked ? <IconLinkOff size={20} /> : <IconLink size={20} />}
              </ActionIcon>
            )}
          </div>
        </Card.Section>

        <div className={`p-5 ${image.isOrphaned ? 'bg-yellow-50' : ''}`}>
          <Group justify='space-between' wrap='nowrap' align='flex-start'>
            <Box className='flex-1'>
              <Tooltip label={image.altText || 'Chưa có mô tả.'}>
                <Text
                  className={`line-clamp-1 text-base font-bold transition-colors duration-300 group-hover:text-mainColor`}
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

            <ActionIcon
              variant='subtle'
              color='gray'
              radius='xl'
              className='hover:bg-gray-100 dark:hover:bg-dark-dimmed'
            >
              <IconDotsVertical size={18} />
            </ActionIcon>
          </Group>
        </div>
      </Card>
    </>
  );
}
export default memo(ImageCard);
