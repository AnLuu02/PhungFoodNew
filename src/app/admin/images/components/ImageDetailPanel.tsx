'use client';

import {
  Badge,
  Box,
  Button,
  Card,
  CopyButton,
  Drawer,
  Grid,
  GridCol,
  Group,
  Image,
  Loader,
  Modal,
  Paper,
  ScrollAreaAutosize,
  Select,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { EntityType, ImageType } from '@prisma/client';
import { IconCopy, IconDownload, IconEdit, IconTrash, IconUnlink } from '@tabler/icons-react';
import { useCallback, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { NotifyError, NotifySuccess } from '~/lib/FuncHandler/toast';
import { api } from '~/trpc/react';

interface ImageDetailPanelProps {
  imageId: string;
  onClose: () => void;
  onRefresh: () => void;
}

type FormValues = {
  altText: string;
  type: ImageType;
};

export default function ImageDetailPanel({ imageId, onClose, onRefresh }: ImageDetailPanelProps) {
  const [editOpened, { open: openEdit, close: closeEdit }] = useDisclosure(false);
  const { data: image, isLoading } = api.Images.getImageById.useQuery({
    id: imageId
  });
  const deleteMutation = api.Images.delete.useMutation({
    onSuccess: () => {
      NotifySuccess('Chúc mừng bạn đã thao tác thành công.');
      closeEdit();
      onRefresh();
    }
  });
  const updateMutation = api.Images.updateImageMetadata.useMutation({
    onSuccess: () => {
      NotifySuccess('Chúc mừng bạn đã thao tác thành công.');
      closeEdit();
      onRefresh();
    }
  });
  const utils = api.useUtils();
  const detachMutation = api.Images.detachImageFromEntity.useMutation({
    onSuccess: () => {
      onRefresh();
      NotifySuccess('Chúc mừng bạn đã thao tác thành công.');
    },
    onMutate: async newTodo => {
      await utils.Images.getImageById.cancel();
      const prevData = utils.Images.getImageById.getData();
      utils.Images.getImageById.setData({ id: imageId }, old => {
        if (!old) return old;
        const newData = old.associations.filter(i => i.id !== newTodo.entityId);
        return {
          ...old,
          associations: newData,
          isOrphaned: newData.length === 0,
          usageCount: newData.length
        };
      });
      return { prevData };
    },
    onSettled: () => {
      utils.Images.getImageById.invalidate();
    },
    onError: e => {
      NotifyError(e.message);
    }
  });

  const detachAllMutation = api.Images.detachAllAssociations.useMutation({
    onSuccess: () => {
      onRefresh();
    }
  });
  const handleDeleteImage = useCallback(
    (publicId: string) => {
      deleteMutation.mutate({ publicId });
    },
    [detachMutation]
  );

  const handleDetachImage = useCallback(
    (imageId: string, entityType: EntityType, entityId: string) => {
      detachMutation.mutate({ imageId, entityType, entityId });
    },
    [detachMutation]
  );

  const handleDetachAll = useCallback(
    (imageId: string) => {
      detachAllMutation.mutate({ imageId });
    },
    [detachAllMutation]
  );
  const { control, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: {
      altText: '',
      type: ImageType.THUMBNAIL
    }
  });

  useEffect(() => {
    if (image) {
      reset({
        altText: image.altText || '',
        type: image.type || ImageType.THUMBNAIL
      });
    }
  }, [image, reset]);

  const onSubmit = (values: FormValues) => {
    updateMutation.mutate({
      id: imageId,
      ...values
    });
  };

  if (isLoading) {
    return (
      <Drawer position='right' opened={!isLoading} onClose={onClose} size='md'>
        <Loader />
      </Drawer>
    );
  }

  if (!image) return null;

  return (
    <>
      <Drawer
        position='right'
        opened={true}
        onClose={onClose}
        size='60%'
        title={
          <Title order={2} className='font-quicksand'>
            Chi tiết ảnh
          </Title>
        }
        pos={'relative'}
      >
        <Grid columns={24}>
          <GridCol span={9}>
            <Image src={image.url} alt={image.altText || 'Image preview'} />
          </GridCol>
          <GridCol span={15}>
            <ScrollAreaAutosize mah={540} w={'100%'} scrollbarSize={5} className='overflow-x-hidden'>
              <Stack gap='lg' w={'100%'} className='overflow-x-hidden' px={'md'}>
                <Box>
                  <Text size='sm' fw={600} mb='xs'>
                    THÔNG TIN TỆP
                  </Text>
                  <Grid gutter={'lg'} px={'xs'}>
                    <GridCol span={6}>
                      <Paper className='bg-gray-100 dark:bg-dark-card' p={'xs'} pl={'md'}>
                        <Text size='sm' c='dimmed'>
                          Kích thước
                        </Text>
                        <Text size='md' fw={700} className='text-mainColor'>
                          {image.width} × {image.height} px
                        </Text>
                      </Paper>
                    </GridCol>

                    <GridCol span={6}>
                      <Paper className='bg-gray-100 dark:bg-dark-card' p={'xs'} pl={'md'}>
                        <Text size='sm' c='dimmed'>
                          Định dạng
                        </Text>
                        <Text size='md' fw={700} className='text-mainColor'>
                          {image.format || 'Unknown'}
                        </Text>
                      </Paper>
                    </GridCol>

                    <GridCol span={12}>
                      <Paper className='bg-gray-100 dark:bg-dark-card' p={'xs'} pl={'md'}>
                        <Group justify='space-between'>
                          <Box>
                            <Text size='sm' c='dimmed'>
                              Kiểu
                            </Text>
                            <Text size='md' fw={700} className='text-mainColor'>
                              Ảnh đại diện món ăn
                            </Text>
                          </Box>
                          <Badge> {image.type || 'Unknown'}</Badge>
                        </Group>
                      </Paper>
                    </GridCol>
                  </Grid>
                </Box>

                <Box>
                  <Group justify='space-between' mb='xs'>
                    <Text size='sm' fw={600}>
                      DỮ LIỆU MÔ TẢ
                    </Text>
                    <Button
                      size='xs'
                      variant='subtle'
                      className='text-mainColor duration-150 hover:bg-transparent hover:text-subColor'
                      onClick={openEdit}
                    >
                      <IconEdit size={14} style={{ marginRight: 4 }} />
                      Chỉnh sữa
                    </Button>
                  </Group>
                  <Stack gap='xs' px={'xs'}>
                    <Text size='xs' fw={600}>
                      Văn bản thay thế
                    </Text>
                    <Paper className='relative w-full overflow-hidden bg-gray-100 dark:bg-dark-card' p={'xs'} pl={'md'}>
                      <Text size='sm' className='w-full whitespace-normal break-words'>
                        {image.altText || 'Not provided'}
                      </Text>
                    </Paper>

                    <Paper className='bg-gray-100 dark:bg-dark-card' p={'xs'} pl={'md'}>
                      <Group justify='space-between'>
                        <Text size='xs' fw={600}>
                          Ngày tạo:
                        </Text>
                        <Text size='sm' className='text-mainColor' fw={700}>
                          {image.createdAt ? new Date(image.createdAt).toDateString() : 'Unknown'}
                        </Text>
                      </Group>
                    </Paper>
                  </Stack>
                </Box>

                <Card withBorder>
                  <Group justify='space-between' mb='xs'>
                    <Text size='sm' fw={600}>
                      THUỘC ({image.associations.length})
                    </Text>
                    {image.associations.length > 0 && (
                      <Button size='xs' color='red' variant='subtle' onClick={() => handleDetachAll(imageId)}>
                        <IconUnlink size={14} style={{ marginRight: 4 }} />
                        Gỡ tất cả
                      </Button>
                    )}
                  </Group>

                  {image.associations.length === 0 ? (
                    <Badge color='yellow' variant='light'>
                      Ảnh chưa sử dụng - Không có liên kết
                    </Badge>
                  ) : (
                    <Stack gap='sm' px={'xs'}>
                      {image.associations.map(assoc => (
                        <Paper
                          key={`${assoc.type}-${assoc.id}`}
                          p='sm'
                          className='flex w-full items-center justify-between bg-gray-100 dark:bg-dark-background'
                        >
                          <Box>
                            <Text size='sm' fw={500}>
                              {assoc.label}
                            </Text>
                            <Text size='xs' c='dimmed'>
                              ID: {assoc.id}
                            </Text>
                          </Box>
                          <Button
                            size='xs'
                            color='red'
                            variant='subtle'
                            loading={detachMutation.isPending}
                            onClick={() => handleDetachImage(imageId, assoc.type, assoc.id)}
                          >
                            Gỡ
                          </Button>
                        </Paper>
                      ))}
                    </Stack>
                  )}
                </Card>

                <Box>
                  <Text size='sm' fw={600} mb='xs'>
                    ĐƯỜNG DẪN HÌNH ẢNH
                  </Text>
                  <Group w={'100%'} className='overflow-hidden' px={'xs'}>
                    <TextInput value={image.url} readOnly flex={1} size='sm' />
                    <CopyButton value={image.url}>
                      {({ copied, copy }) => (
                        <Button size='sm' onClick={copy} leftSection={<IconCopy size={14} />} w={150}>
                          {copied ? 'Đã sao chép' : 'Sao chép'}
                        </Button>
                      )}
                    </CopyButton>
                  </Group>
                </Box>
              </Stack>
            </ScrollAreaAutosize>
          </GridCol>
        </Grid>
        <Group
          pos={'fixed'}
          bottom={0}
          left={0}
          right={0}
          justify='space-between'
          p={'md'}
          px={'xl'}
          className='bg-gray-100 dark:bg-dark-card'
        >
          <Button
            size='sm'
            variant='danger'
            loading={deleteMutation.isPending}
            disabled={!image?.publicId}
            leftSection={<IconTrash size={14} />}
            onClick={() => image?.publicId && handleDeleteImage(image?.publicId)}
          >
            Xóa
          </Button>
          <Group>
            <Button size='sm' color='red' variant='subtle' onClick={onClose}>
              Hủy bỏ
            </Button>
            <a href={image.url} download={true} target='_blank'>
              <Button size='sm' leftSection={<IconDownload size={14} />}>
                Tải xuống
              </Button>
            </a>
          </Group>
        </Group>
      </Drawer>

      <Modal
        opened={editOpened}
        onClose={closeEdit}
        title={'Chỉnh sửa Metadata ảnh'}
        classNames={{
          title: 'font-quicksand text-2xl font-bold'
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack gap='md'>
            <Controller
              name='altText'
              control={control}
              render={({ field }) => <Textarea label='Alt Text' placeholder='Describe this image...' {...field} />}
            />

            <Controller
              name='type'
              control={control}
              render={({ field }) => (
                <Select
                  label='Image Type'
                  placeholder='Select type'
                  data={Object.values(ImageType).map(t => ({
                    value: t,
                    label: t
                  }))}
                  {...field}
                />
              )}
            />

            <Group justify='flex-end'>
              <Button variant='danger' onClick={closeEdit}>
                Hủy bỏ
              </Button>
              <Button loading={updateMutation.isPending} type='submit'>
                Lưu
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </>
  );
}
