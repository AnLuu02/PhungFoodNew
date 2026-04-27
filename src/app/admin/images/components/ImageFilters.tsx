'use client';

import { IconCloudUpload, IconSearch } from '@tabler/icons-react';

import { Button, Group, MultiSelect, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { api } from '~/trpc/react';
import { ImageFilterOptions } from '../types/image.types';
import { UploadModal } from './ImageUploadModal';

export default function ImageFilters({
  filters,
  onFilters,
  refetch
}: {
  filters: ImageFilterOptions;
  onFilters: (key: keyof ImageFilterOptions, value: any) => any;
  refetch: any;
}) {
  const [uploaderOpened, { open: openUploader, close: closeUploader }] = useDisclosure(false);

  const { data: enumOptions } = api.Images.getEnumOptions.useQuery();

  const imageTypeOptions = enumOptions?.imageTypes.map(type => ({ value: type, label: type })) ?? [];
  const entityTypeOptions = enumOptions?.entityTypes.map(type => ({ value: type, label: type })) ?? [];

  return (
    <>
      <Group justify='space-between' w={'100%'} align='center'>
        <TextInput
          size='md'
          flex={1}
          radius={'xl'}
          placeholder='Tìm kiếm theo văn bản thay thế (alt text) hoặc URL...'
          leftSection={<IconSearch size={16} />}
          value={filters.searchQuery}
          onChange={e => onFilters('searchQuery', e.currentTarget.value)}
        />
        <MultiSelect
          radius={'xl'}
          placeholder='Tất cả các loại'
          data={imageTypeOptions}
          value={filters.imageTypes}
          onChange={val => onFilters('imageTypes', val)}
          searchable
          clearable
        />
        <MultiSelect
          radius={'xl'}
          placeholder='Tất cả đối tượng'
          data={entityTypeOptions}
          value={filters.entityTypes}
          onChange={val => onFilters('entityTypes', val)}
          searchable
          clearable
        />

        <Button
          onClick={openUploader}
          size='sm'
          leftSection={<IconCloudUpload size={16} />}
          radius={'xl'}
          variant='outline'
        >
          Tải ảnh lên
        </Button>
      </Group>
      <UploadModal opened={uploaderOpened} onClose={closeUploader} onSuccess={refetch} />
    </>
  );
}
