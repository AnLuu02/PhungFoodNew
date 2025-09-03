import { Badge, Button, Card, Group, Stack, Text } from '@mantine/core';
import { IconMaximize, IconTrash } from '@tabler/icons-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { confirmDelete } from '~/lib/button-handle/ButtonDeleteConfirm';
import { formatDateViVN } from '~/lib/func-handler/Format';
import { NotifySuccess } from '~/lib/func-handler/toast';
import { api } from '~/trpc/react';
import { formatBytes } from './ListImages/ListImages';

interface PhotoCardProps {
  id: string;
  name: string;
  file: File;
  postingDate: Date;
  onOpened: ({ id, name, file, dimensions, postingDate }: any) => void;
}

const getImageSizePixel = (file?: File): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('File is not provided'));
      return;
    }
    const img = new window.Image();
    img.onload = () => resolve({ width: img.width, height: img.height });
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};

export default function PhotoCard({ id, name, file, postingDate, onOpened }: PhotoCardProps) {
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const mutationDelete = api.Image.delete.useMutation();
  const utils = api.useUtils();

  useEffect(() => {
    if (file instanceof File) {
      getImageSizePixel(file)
        .then(setDimensions)
        .catch(() => setDimensions(null));
    }
  }, [file]);

  return (
    <Card shadow='sm' padding='lg' radius='md' withBorder>
      <Card.Section>
        <Image
          loading='lazy'
          src={file instanceof File ? URL.createObjectURL(file) : '/images/empty-300x240.jpg'}
          height={160}
          width={160}
          style={{ objectFit: 'cover' }}
          alt={name}
          onClick={() => onOpened({ id, name, file, dimensions, postingDate })}
          className='cursor-pointer'
        />
      </Card.Section>

      <Stack mt='md' gap='xs'>
        <Text fw={700} truncate>
          {name}
        </Text>
        <Group justify='space-between'>
          <Text size='sm' c='dimmed'>
            Size: {file && formatBytes(file.size || 0)}
          </Text>
          {dimensions && (
            <Badge color='blue'>
              {dimensions.width}x{dimensions.height}
            </Badge>
          )}
        </Group>
        <Text size='sm' c='dimmed'>
          Tải lên ngày: {formatDateViVN(postingDate)}
        </Text>
      </Stack>

      <Group mt='md'>
        <Button
          variant='light'
          color='blue'
          fullWidth
          leftSection={<IconMaximize size={14} />}
          onClick={() => onOpened({ id, name, file, dimensions, postingDate })}
        >
          View Full
        </Button>
        <Button
          variant='light'
          color='red'
          fullWidth
          leftSection={<IconTrash size={14} />}
          onClick={() => {
            confirmDelete({
              id: { id },
              mutationDelete,
              entityName: 'ảnh',
              callback: () => {
                utils.Image.invalidate();
                NotifySuccess('Xóa hình anh thành công');
              }
            });
          }}
        >
          Delete
        </Button>
      </Group>
    </Card>
  );
}
