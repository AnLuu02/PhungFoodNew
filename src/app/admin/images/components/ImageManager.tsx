'use client';

import { IconAlertTriangle, IconFilter } from '@tabler/icons-react';

import {
  Alert,
  Box,
  Button,
  Checkbox,
  Container,
  Flex,
  Group,
  Modal,
  Stack,
  Text,
  Title,
  Tooltip,
  UnstyledButton
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { EntityType, ImageType } from '@prisma/client';
import { useCallback, useState } from 'react';
import PaginationLocal from '~/components/PaginationLocal';
import { api } from '~/trpc/react';
import { ImageFilterOptions } from '../types/image.types';
import BulkActionsBar from './BulkActionsBar';
import HeroSectionImages from './HeroSection';
import ImageFilters from './ImageFilters';
import ImageRenderGrid from './ImageRenderGrid';

const ITEMS_PER_PAGE = 10;
const TABS = [
  { value: 'all', label: 'Tất cả' },
  { value: ImageType.THUMBNAIL, label: 'Ảnh minh họa' },
  { value: ImageType.GALLERY, label: 'Ảnh bổ sung' }
];
const TABS2 = [
  { value: 'all', label: 'Tất cả' },
  { value: EntityType.PRODUCT, label: 'Sản phẩm' },
  { value: EntityType.USER, label: 'Người dùng' }
];
export default function ImageManager() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(ITEMS_PER_PAGE);
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<ImageFilterOptions>({
    imageTypes: [],
    entityTypes: [],
    showOrphanedOnly: false,
    searchQuery: ''
  });
  const [deleteConfirmOpened, { open: openDeleteConfirm, close: closeDeleteConfirm }] = useDisclosure(false);
  const [bulkDeleteOrphaned, setBulkDeleteOrphaned] = useState(false);

  const { data: enumOptions } = api.Images.getEnumOptions.useQuery();

  const {
    data: imagesData,
    isLoading,
    refetch
  } = api.Images.getAllImages.useQuery({
    skip: (page - 1) * perPage,
    take: perPage,
    ...filters
  });

  const bulkDeleteMutation = api.Images.bulkDeleteImages.useMutation({
    onSuccess: () => {
      setSelectedImages(new Set());
      closeDeleteConfirm();
      refetch();
    }
  });

  const bulkUpdateTypeMutation = api.Images.bulkUpdateImageType.useMutation({
    onSuccess: () => {
      refetch();
    }
  });

  const handleSelectAll = useCallback(() => {
    if (imagesData?.data) {
      if (selectedImages.size === imagesData.data.length) {
        setSelectedImages(new Set());
      } else {
        setSelectedImages(new Set(imagesData.data.map(img => img.id)));
      }
    }
  }, [imagesData?.data, selectedImages.size]);

  const handleFilterChange = useCallback((key: keyof ImageFilterOptions, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setPage(1);
  }, []);

  const handleBulkDelete = useCallback(() => {
    bulkDeleteMutation.mutate({
      imageIds: Array.from(selectedImages),
      deleteOrphaned: bulkDeleteOrphaned
    });
  }, [selectedImages, bulkDeleteOrphaned, bulkDeleteMutation]);

  const imageTypeOptions = enumOptions?.imageTypes.map(type => ({ value: type, label: type })) ?? [];
  const totalPages = Math.ceil((imagesData?.total ?? 0) / perPage);

  return (
    <Container size='xl' py='lg'>
      <Stack gap={'md'}>
        {/* HEADER */}
        <HeroSectionImages imagesData={imagesData} />

        {/*  */}
        <ImageFilters filters={filters} onFilters={handleFilterChange} refetch={refetch} />
        {/* FILTER BAR */}
        <Box className='flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center'>
          <Group gap={12} wrap='wrap'>
            {/* Group 1: Image Type */}
            <Box className='flex w-fit rounded-full bg-[#f3f4f6] p-1'>
              {TABS.map(tab => {
                const isActive =
                  tab.value === 'all' && filters.imageTypes.length === 0
                    ? true
                    : filters.imageTypes.includes(tab.value as ImageType);

                return (
                  <UnstyledButton
                    key={tab.value}
                    onClick={() => handleFilterChange('imageTypes', tab.value === 'all' ? [] : [tab.value])}
                    className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                      isActive ? 'text-primary bg-white font-bold shadow-sm' : 'text-gray-600 hover:text-black'
                    } `}
                  >
                    {tab.label}
                  </UnstyledButton>
                );
              })}
            </Box>

            {/* Group 2: Entities */}
            {/* <Box className='flex w-fit rounded-full bg-[#f3f4f6] p-1'>
              {TABS2.map(tab => {
                const isActive =
                  tab.value === 'all' && filters.entityTypes.length === 0
                    ? true
                    : filters.entityTypes.includes(tab.value as EntityType);

                return (
                  <UnstyledButton
                    key={tab.value}
                    onClick={() => handleFilterChange('entityTypes', tab.value === 'all' ? [] : [tab.value])}
                    className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                      isActive ? 'text-primary bg-white font-bold shadow-sm' : 'text-gray-600 hover:text-black'
                    } `}
                  >
                    {tab.label}
                  </UnstyledButton>
                );
              })}
            </Box> */}
          </Group>

          {/* Right Side Actions */}
          <Box className='flex w-full items-center gap-3 lg:w-auto'>
            {imagesData && imagesData?.data?.length > 0 && (
              <Flex
                align={'center'}
                component='label'
                htmlFor='select_all_image_delete'
                gap={'sm'}
                className='h-[42px] flex-1 cursor-pointer rounded-full border border-solid border-gray-200 px-6 text-sm font-bold text-gray-800 hover:bg-gray-200 hover:font-bold lg:flex-none'
              >
                <Checkbox
                  id='select_all_image_delete'
                  checked={selectedImages.size === imagesData?.data?.length && imagesData?.data?.length > 0}
                  onChange={handleSelectAll}
                  p={0}
                  m={0}
                  className='h-4 w-4 rounded border-gray-300'
                />
                <Text className='text-sm text-gray-600'>
                  {selectedImages.size > 0 ? `${selectedImages.size} ảnh đã chọn` : 'Chọn tất cả'}
                </Text>
              </Flex>
            )}
            <Tooltip label='Bật/tắt bộ lọc'>
              <Button
                variant={filters.showOrphanedOnly ? 'filled' : 'outline'}
                onClick={() => handleFilterChange('showOrphanedOnly', !filters.showOrphanedOnly)}
                leftSection={<IconFilter size={16} />}
                className={`h-[42px] flex-1 rounded-full border-gray-200 px-6 text-sm font-bold text-gray-800 lg:flex-none ${filters.showOrphanedOnly ? 'bg-gray-800 text-white' : ''}`}
                color='gray'
              >
                Ảnh chưa sử dụng
              </Button>
            </Tooltip>
          </Box>
        </Box>

        {selectedImages.size > 0 && (
          <BulkActionsBar
            selectedCount={selectedImages.size}
            onDelete={openDeleteConfirm}
            onClearSelection={() => setSelectedImages(new Set())}
            bulkUpdateTypeMutation={bulkUpdateTypeMutation}
            imageTypeOptions={imageTypeOptions}
          />
        )}

        {/* GRID */}
        <ImageRenderGrid imagesData={imagesData} isLoading={isLoading} refetch={refetch} />

        {/* PAGINATION */}
        <Group justify='space-between' my='xl'>
          <Text size='sm' c='dimmed'>
            Hiển thị {(page - 1) * perPage} - {(page + 1) * perPage} trong tổng số {imagesData?.total} ảnh
          </Text>

          <PaginationLocal
            initPerpage={perPage}
            onChangePage={setPage}
            onChangePerPage={setPerPage}
            totalPages={totalPages}
          />
        </Group>
      </Stack>

      <Modal
        opened={deleteConfirmOpened}
        radius={'md'}
        onClose={closeDeleteConfirm}
        title={
          <Title order={2} className='font-quicksand'>
            Xác nhận xóa hàng loạt
          </Title>
        }
        centered
      >
        <Stack gap='md'>
          <Alert icon={<IconAlertTriangle size={16} />} color='red'>
            Bạn sắp xóa {selectedImages.size} hình ảnh. Thao tác này không thể hoàn tác.
          </Alert>

          <Checkbox
            label='Xóa các hình ảnh liên kết (nếu có).'
            checked={bulkDeleteOrphaned}
            onChange={e => setBulkDeleteOrphaned(e.currentTarget.checked)}
          />

          <Group justify='flex-end'>
            <Button variant='default' onClick={closeDeleteConfirm}>
              Hủy bỏ
            </Button>
            <Button color='red' loading={bulkDeleteMutation.isPending} onClick={handleBulkDelete}>
              Xóa bỏ
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
}
