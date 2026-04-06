'use client';

import { IconAlertTriangle } from '@tabler/icons-react';

import { Center, Loader, SimpleGrid, Stack, Text } from '@mantine/core';
import { useCallback, useState } from 'react';
import { ImageWithAssociations } from '../types/image.types';
import { ImageCard } from './ImageCard';
import ImageDetailPanel from './ImageDetailPanel';

export default function ImageRenderGrid({
  imagesData,
  isLoading,
  refetch,
  mode,
  imageIdConnected,
  onConnected
}: {
  imagesData:
    | {
        data: ImageWithAssociations[];
        total: number;
        pageInfo: {
          skip: number;
          take: number;
          hasMore: boolean;
        };
      }
    | undefined;
  isLoading: boolean;
  refetch: any;
  mode?: 'library' | 'page';
  imageIdConnected?: string;
  onConnected?: (imageId: string, mode?: 'connect' | 'disconnect') => void;
}) {
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());

  const [detailImageId, setDetailImageId] = useState<string | null>(null);

  const handleSelectImage = useCallback((imageId: string) => {
    setSelectedImages(prev => {
      const next = new Set(prev);
      if (next.has(imageId)) {
        next.delete(imageId);
      } else {
        next.add(imageId);
      }
      return next;
    });
  }, []);

  return (
    <>
      {/* GRID */}
      {isLoading ? (
        <Center py={120}>
          <Stack align='center'>
            <Loader />
            <Text c='dimmed'>Đang tải hình ảnh...</Text>
          </Stack>
        </Center>
      ) : imagesData?.data.length === 0 ? (
        <Center py={120}>
          <Stack align='center'>
            <IconAlertTriangle size={48} color='var(--mantine-color-gray-4)' />
            <Text c='dimmed'>Không tìm thấy hình ảnh nào</Text>
          </Stack>
        </Center>
      ) : (
        <>
          <SimpleGrid cols={{ base: 2, sm: 3, md: 4 }} spacing='md' mb='xl'>
            {imagesData?.data.map(image => (
              <ImageCard
                key={image.id}
                image={image}
                mode={mode}
                imageIdConnected={imageIdConnected}
                isSelected={selectedImages.has(image.id)}
                onSelect={() => handleSelectImage(image.id)}
                onEdit={() => setDetailImageId(image.id)}
                onConnected={onConnected}
              />
            ))}
          </SimpleGrid>
        </>
      )}
      {detailImageId && (
        <ImageDetailPanel imageId={detailImageId} onClose={() => setDetailImageId(null)} onRefresh={refetch} />
      )}
    </>
  );
}
