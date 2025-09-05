'use client';
import { Badge, Grid, Group, Modal, Stack, Text } from '@mantine/core';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import PageSizeSelector from '~/components/Admin/Perpage';
import LoadingSpiner from '~/components/Loading/LoadingSpiner';
import CustomPagination from '~/components/Pagination';
import { formatDateViVN } from '~/lib/func-handler/Format';
import { vercelBlobToFile } from '~/lib/func-handler/handle-file-base64';
import { api } from '~/trpc/react';
import PhotoCard from '../PhotoCard';
export const formatBytes = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
export default function ListImage({ currentPage, s, limit }: { currentPage: string; s: string; limit: string }) {
  const { data: result, isLoading } = api.Image.find.useQuery({ skip: +currentPage, take: +limit, s });
  const currentItems = result?.images || [];
  const [imageUrls, setImageUrls] = useState<any[]>([]);
  const [showfullImage, setShowfullImage] = useState<any>('');

  useEffect(() => {
    const loadImages = async () => {
      if (!Array.isArray(currentItems)) return;

      const urls = await Promise.all(
        currentItems.map(async image => {
          try {
            const file = await vercelBlobToFile(image.url as string);

            if (file instanceof Blob) {
              return {
                ...image,
                url: file
              };
            } else {
              console.error('getImage không trả về Blob', file);
              return {
                ...image
              };
            }
          } catch {
            console.error('Lỗi khi tải ảnh:');
            return image.url;
          }
        })
      );

      setImageUrls(urls);
    };

    loadImages();
  }, [currentItems]);

  if (isLoading) return <LoadingSpiner />;

  return (
    <>
      {imageUrls.length > 0 ? (
        <Grid>
          {imageUrls.map(image => (
            <Grid.Col key={image.id} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
              <PhotoCard
                id={image.id}
                name={image.altText || 'No Name'}
                file={image.url}
                postingDate={image.postingDate || new Date()}
                onOpened={({ id, name, file, dimensions, postingDate }) =>
                  setShowfullImage({ id, name, file, dimensions, postingDate })
                }
              />
            </Grid.Col>
          ))}
        </Grid>
      ) : (
        <h1>Hiện tại chưa có ảnh</h1>
      )}
      <Modal opened={showfullImage?.file} onClose={() => setShowfullImage({})} size='xl' centered>
        <Image
          loading='lazy'
          src={(showfullImage.file && URL.createObjectURL(showfullImage.file)) || '/images/jpg/empty-300x240.jpg'}
          alt={showfullImage.name || ''}
          style={{ objectFit: 'cover' }}
          height={400}
          width={400}
        />
        <Stack mt='md' gap='xs'>
          <Text size='lg' fw={700}>
            {showfullImage?.name || ''}
          </Text>
          <Text size='sm'>Dung lượng: {formatBytes(showfullImage?.file?.size || 0)}</Text>
          <Badge color='blue'>
            Kích thước: {showfullImage?.dimensions?.width || 0}x{showfullImage?.dimensions?.height || 0} pixels
          </Badge>
          <Text size='sm'>Tải lên ngày: {formatDateViVN(new Date())} </Text>
        </Stack>
      </Modal>
      <Group justify='space-between' mt='md'>
        <PageSizeSelector />
        <CustomPagination totalPages={result?.pagination.totalPages || 1} />
      </Group>
    </>
  );
}
