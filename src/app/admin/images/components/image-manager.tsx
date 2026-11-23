'use client';

import { IconAlertTriangle, IconFilter } from '@tabler/icons-react';

import {
  Alert,
  Box,
  Button,
  Center,
  Checkbox,
  Flex,
  Group,
  Modal,
  SimpleGrid,
  Stack,
  Text,
  Tooltip,
  UnstyledButton
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ImageType } from '@prisma/client';
import { useCallback, useState } from 'react';
import { ConnectedModalPayload } from '~/components/modals/modal-image-library';
import { ModalUpsertSkeleton } from '~/components/forms/modal-upsert-skeleton';
import PaginationLocal from '~/components/common/pagination-local';
import { useModalStore } from '~/stores/modal.store';
import { api } from '~/trpc/react';
import { ConnectedState, ConnectedStateWithEntity, ImageFilterOptions } from '../../../../shared/types/image.types';
import BulkActionsBar from '~/app/admin/images/components/bulk-actions-bar';
import HeroSectionImages from '~/app/admin/images/components/hero-section';
import ImageCard from '~/app/admin/images/components/image-card';
import { ImageConnectedInfoModal } from '~/app/admin/images/components/image-connected-info-modal';
import ImageDetailPanel from '~/app/admin/images/components/image-detail-panel';
import ImageFilters from '~/app/admin/images/components/image-filters';

const ITEMS_PER_PAGE = 12;
const TABS = [
  { value: 'all', label: 'Tất cả' },
  { value: ImageType.THUMBNAIL, label: 'Ảnh minh họa' },
  { value: ImageType.GALLERY, label: 'Ảnh bổ sung' }
];

export default function ImageManager({ mode }: { mode: 'library' | 'page' }) {
  const { data }: { data: ConnectedModalPayload } = useModalStore(s => s.data) ?? {};
  const { data: imageForEntity, isLoading: isLoadingImageForEntity } = api.Images.getImageForEntity.useQuery(
    {
      entityId: data?.entityId || ''
    },
    { enabled: !!data?.entityId }
  );

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(ITEMS_PER_PAGE);
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<ImageFilterOptions>({});
  const [deleteConfirmOpened, { open: openDeleteConfirm, close: closeDeleteConfirm }] = useDisclosure(false);
  const [bulkDeleteOrphaned, setBulkDeleteOrphaned] = useState(false);
  const [connectedState, setConnectedState] = useState<ConnectedStateWithEntity>({
    opened: false
  });
  const [detailImageId, setDetailImageId] = useState<string | null>(null);
  const { data: enumOptions } = api.Images.getEnumOptions.useQuery();
  const {
    data: imagesData,
    isLoading,
    refetch
  } = api.Images.find.useQuery({
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
  const toggleSelectAll = useCallback(() => {
    if (imagesData?.data) {
      if (selectedImages.size === imagesData?.data?.length) {
        setSelectedImages(new Set());
      } else {
        setSelectedImages(new Set(imagesData.data.map(img => img.id)));
      }
    }
  }, [imagesData?.data, selectedImages.size]);
  const handleFilterChange = useCallback((key: keyof ImageFilterOptions, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value ? value : undefined
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
  const handleConnectImage = useCallback((state: ConnectedState) => {
    const existingImage = imageForEntity?.find(item => item?.imageId === state?.imageId);
    setConnectedState(prev => ({
      ...prev,
      ...state,
      entityId: data.entityId,
      entityType: data.entityType,
      imageType: data.initImageType,
      imageForEntityId: existingImage?.id,
      onRefetch: data?.onRefetch
    }));
  }, []);

  console.log(filters);

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

  const onLinked = useCallback(
    (imageId: string) => {
      const linked = imageForEntity ? imageForEntity.find(i => i.imageId === imageId) : null;
      if (Boolean(linked)) return { id: linked?.id, type: linked?.type };
      return { id: undefined, type: undefined };
    },
    [imageForEntity]
  );
  return (
    <>
      <Box p='lg'>
        <Stack gap={'md'}>
          <HeroSectionImages imagesData={imagesData} />
          <ImageFilters filters={filters} onFilters={handleFilterChange} refetch={refetch} />
          <Box className='flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center'>
            <Group gap={12} wrap='wrap'>
              <Box className='flex w-fit rounded-full bg-[#f3f4f6] p-1 dark:bg-dark-card'>
                {TABS.map(tab => {
                  const isActive = tab.value === 'all' && !filters.imageType ? true : filters.imageType === tab.value;

                  return (
                    <UnstyledButton
                      key={tab.value}
                      onClick={() => handleFilterChange('imageType', tab.value === 'all' ? undefined : tab.value)}
                      className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                        isActive
                          ? 'text-primary bg-white font-bold shadow-sm dark:bg-dark-background'
                          : 'text-gray-600 hover:text-black dark:text-dark-text dark:hover:bg-dark-dimmed'
                      } `}
                    >
                      {tab.label}
                    </UnstyledButton>
                  );
                })}
              </Box>
            </Group>

            <Box className='flex w-full items-center gap-3 lg:w-auto'>
              {imagesData && imagesData?.data?.length > 0 && (
                <Flex
                  align={'center'}
                  component='label'
                  htmlFor='select_all_image_delete'
                  gap={'sm'}
                  className='h-[42px] flex-1 cursor-pointer rounded-full border border-solid border-gray-200 px-6 text-sm font-bold text-gray-800 hover:bg-gray-200 hover:font-bold dark:border-dark-card dark:hover:bg-dark-background lg:flex-none'
                >
                  <Text size='sm' c={'dimmed'}>
                    {selectedImages.size > 0 ? `${selectedImages.size} ảnh đã chọn` : 'Chọn tất cả'}
                  </Text>
                  <Checkbox
                    id='select_all_image_delete'
                    checked={selectedImages.size === imagesData?.data?.length && imagesData?.data?.length > 0}
                    onChange={toggleSelectAll}
                    p={0}
                    m={0}
                    className='h-4 w-4 rounded border-gray-300'
                  />
                </Flex>
              )}
              <Tooltip label='Bật/tắt bộ lọc'>
                <Button
                  variant={'outline'}
                  active={filters.showOrphanedOnly}
                  onClick={() => handleFilterChange('showOrphanedOnly', !filters.showOrphanedOnly)}
                  leftSection={<IconFilter size={16} />}
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
          <>
            {isLoading || isLoadingImageForEntity ? (
              <ModalUpsertSkeleton />
            ) : imagesData?.data?.length === 0 ? (
              <Center py={120}>
                <Stack align='center'>
                  <IconAlertTriangle size={48} color='var(--mantine-color-gray-4)' />
                  <Text c='dimmed'>Không tìm thấy hình ảnh nào</Text>
                </Stack>
              </Center>
            ) : (
              <>
                <SimpleGrid cols={{ base: 2, sm: 3, md: 4 }} spacing='md' mb='xl'>
                  {(imagesData?.data ?? []).map(image => {
                    return (
                      <ImageCard
                        key={`${image.id}`}
                        image={image}
                        mode={mode}
                        linkedPayload={onLinked(image.id)}
                        isSelected={selectedImages.has(image.id)}
                        onSelect={() => handleSelectImage(image.id)}
                        onConnected={handleConnectImage}
                        onEdit={() => setDetailImageId(image.id)}
                      />
                    );
                  })}
                </SimpleGrid>
              </>
            )}
            {detailImageId && (
              <ImageDetailPanel imageId={detailImageId} onClose={() => setDetailImageId(null)} onRefresh={refetch} />
            )}
          </>

          <Group justify='space-between' my='xl'>
            <Text size='sm' c='dimmed'>
              Hiển thị {(page - 1) * perPage} - {(page + 1) * perPage} trong tổng số {imagesData?.total} ảnh
            </Text>

            <PaginationLocal
              perPage={perPage}
              page={page}
              onChangePage={setPage}
              onSetPerpage={setPerPage}
              totalPages={totalPages}
            />
          </Group>
        </Stack>

        <Modal
          opened={deleteConfirmOpened}
          onClose={closeDeleteConfirm}
          title={`
              Xác nhận xóa hàng loạt
            `}
          classNames={{
            title: 'font-quicksand text-2xl font-bold'
          }}
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
              <Button variant='outline' onClick={closeDeleteConfirm}>
                Hủy bỏ
              </Button>
              <Button variant='danger' loading={bulkDeleteMutation.isPending} onClick={handleBulkDelete}>
                Xóa bỏ
              </Button>
            </Group>
          </Stack>
        </Modal>
      </Box>
      <ImageConnectedInfoModal connectedState={connectedState} onClose={() => setConnectedState({ opened: false })} />
    </>
  );
}
