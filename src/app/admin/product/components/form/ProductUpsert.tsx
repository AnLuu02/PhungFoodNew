'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Grid,
  GridCol,
  MultiSelect,
  NumberInput,
  Select,
  Stack,
  Switch,
  TagsInput,
  Text,
  Textarea,
  TextInput
} from '@mantine/core';
import { EntityType, ImageType } from '@prisma/client';
import { IconCheck, IconX } from '@tabler/icons-react';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Controller, FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import ThumbnailUpsert from '~/components/ImageFormUpsert';
import { ModalUpsertSkeleton } from '~/components/ModelUpsertSkeleton';
import { TiptapEditor } from '~/components/Tiptap/TiptapEditor';
import { useModalActions } from '~/contexts/ModalContext';
import { handleUploadFromClient, uploadMultipleToCloudinaryFromClient } from '~/lib/Cloudinary/client';
import { NotifyError, NotifySuccess } from '~/lib/FuncHandler/toast';
import { seedRegions } from '~/lib/HardData/seed';
import { UserRole } from '~/shared/constants/user';
import { StatusImage } from '~/shared/schema/image.info.schema';
import { ProductInput, productInputSchema } from '~/shared/schema/product.schema';
import { api } from '~/trpc/react';
import GalleryUpsert from './GalleryUpsert';

export default function ProductUpsert({
  productId,
  setOpened
}: {
  productId?: string;
  setOpened: Dispatch<SetStateAction<boolean>>;
}) {
  const { openModal } = useModalActions();
  const [imageDeleted, setImageDeleted] = useState<string[]>([]);
  const { data: categories } = api.SubCategory.getAll.useQuery();
  const { data: materials } = api.Material.getAll.useQuery();
  const { data, isLoading } = api.Product.getOne.useQuery(
    { s: productId || '', userRole: UserRole.ADMIN },
    { enabled: !!productId }
  );

  const formFields = useForm<ProductInput>({
    resolver: zodResolver(productInputSchema),
    defaultValues: {
      id: undefined,
      name: '',
      tag: '',
      description: '',
      price: 0,
      discount: 0,
      region: 'Miền Nam',
      availableQuantity: 0,
      soldQuantity: 0,
      tags: [],
      isActive: false,
      descriptionDetailJson: {},
      descriptionDetailHtml: '<p>Đang cập nhật</p>',
      thumbnail: undefined,
      gallery: [],
      subCategoryId: '',
      materials: []
    },
    mode: 'onChange'
  });

  useEffect(() => {
    if (data) {
      formFields.reset({
        id: data?.id,
        name: data?.name,
        tag: data?.tag,
        description: data?.description || '',
        price: data?.price,
        discount: data?.discount,
        region: data?.region,
        tags: data?.tags,
        availableQuantity: data?.availableQuantity || 0,
        soldQuantity: data?.soldQuantity || 0,
        isActive: data?.isActive || false,
        subCategoryId: data?.subCategoryId as string,
        materials: Array.isArray(data?.materials) ? data.materials.map((material: any) => material.id) : [],
        descriptionDetailJson: data?.descriptionDetailJson || {},
        descriptionDetailHtml: data?.descriptionDetailHtml || '<p>Đang cập nhật</p>',
        thumbnail:
          data?.imageForEntities?.length > 0
            ? (data?.imageForEntities?.find(item => item?.type === ImageType.THUMBNAIL) as any)
            : undefined,
        gallery:
          data?.imageForEntities?.length > 0
            ? (data?.imageForEntities?.filter(item => item?.type === ImageType.GALLERY) as any)
            : []
      });
    }
  }, [data, formFields.reset]);
  const utils = api.useUtils();
  const updateMutation = api.Product.upsertToCloudinary.useMutation({
    onSuccess: () => {
      NotifySuccess('Chúc mừng bạn đã thao tác thành công.');
      setOpened(false);
      utils.Product.invalidate();
    },
    onError: e => {
      NotifyError(e.message);
    }
  });

  const onSubmit: SubmitHandler<ProductInput> = async formData => {
    const thumbnailFile = formFields.getValues('thumbnail.image.urlFile');
    const thumbnailPublicId = formFields.getValues('thumbnail.image.publicId');
    const galleryInputFile = formFields.getValues('galleryInput');
    const thumbnailToSave = thumbnailFile
      ? await handleUploadFromClient(thumbnailFile, utils, {
          folder: EntityType.PRODUCT + '/' + ImageType.THUMBNAIL
        })
      : undefined;
    const galleryToSave =
      galleryInputFile && galleryInputFile?.length > 0
        ? await uploadMultipleToCloudinaryFromClient(galleryInputFile, utils, {
            folder: EntityType.PRODUCT + '/' + ImageType.GALLERY
          })
        : [];

    const thumbnailItem = data?.imageForEntities?.find((item: any) => item?.type === ImageType.THUMBNAIL);
    const thumbnailFromDb: any = thumbnailItem ? { ...thumbnailItem } : {};

    const formDataWithImageUrlAsString = {
      ...formData,
      imageForEntities: [
        ...(thumbnailToSave
          ? [
              {
                altText: thumbnailFromDb?.altText || 'Ảnh chính của sản phẩm ' + data?.name,
                type: thumbnailFromDb?.type || ImageType.THUMBNAIL,
                status: StatusImage.NEW,
                image: {
                  ...thumbnailToSave,
                  id: undefined,
                  altText: formData?.thumbnail?.altText || 'Ảnh chính của sản phẩm ' + (formData?.name || ''),
                  type: formData?.thumbnail?.type || ImageType.THUMBNAIL
                }
              },
              ...(thumbnailFromDb?.image?.publicId
                ? [
                    {
                      id: thumbnailFromDb?.id,
                      status: StatusImage.DELETED
                    }
                  ]
                : [])
            ]
          : thumbnailFromDb?.id && !thumbnailPublicId
            ? [
                {
                  id: thumbnailFromDb?.id,
                  type: ImageType.THUMBNAIL,
                  status: StatusImage.DELETED
                }
              ]
            : []),
        ...(galleryToSave && galleryToSave?.length > 0
          ? galleryToSave?.map((item, index: number) => ({
              type: ImageType.GALLERY,
              altText: `Ảnh bổ sung ${index + 1} của sản phẩm ` + data?.name,
              status: StatusImage.NEW,
              image: {
                ...item,
                id: undefined,
                altText: 'Ảnh của danh mục ' + (formData?.name || ''),
                type: ImageType.GALLERY
              }
            }))
          : []),
        ...(imageDeleted && imageDeleted?.length > 0
          ? imageDeleted.map(imageForEntityId => ({
              id: imageForEntityId,
              type: ImageType.GALLERY,
              status: StatusImage.DELETED
            }))
          : [])
      ]
    };
    await updateMutation.mutateAsync({
      ...formDataWithImageUrlAsString,
      id: formData?.id || '',
      descriptionDetailJson: formData.descriptionDetailJson,
      descriptionDetailHtml: formData.descriptionDetailHtml
    });
  };
  useEffect(() => {
    const handleSubmitForm = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        formFields.handleSubmit(onSubmit)();
      }
    };
    window.addEventListener('keypress', handleSubmitForm);
    return () => {
      window.removeEventListener('keypress', handleSubmitForm);
    };
  }, []);
  if (isLoading) return <ModalUpsertSkeleton />;
  return (
    <FormProvider {...formFields}>
      <form onSubmit={formFields.handleSubmit(onSubmit)} className='w-full'>
        <Grid w={'100%'}>
          <GridCol span={6}>
            <Stack>
              <ThumbnailUpsert nameField='thumbnail.image' />
              <Button
                variant='outline'
                size='sm'
                fullWidth
                className='w-[max-content]'
                onClick={async () =>
                  openModal('images_library', undefined, {
                    entityId: data?.id,
                    entityType: EntityType.PRODUCT,
                    initImageType: ImageType.THUMBNAIL,
                    onRefetch: () => {
                      utils.Product.invalidate();
                    }
                  })
                }
              >
                Chọn ảnh từ thư viện
              </Button>
            </Stack>
          </GridCol>
          <GridCol span={12}>
            <Stack>
              <GalleryUpsert onDeleted={imgPublicIds => setImageDeleted(imgPublicIds)} />
              <Button
                variant='outline'
                className='w-[max-content]'
                size='sm'
                fullWidth
                onClick={async () =>
                  openModal('images_library', undefined, {
                    entityId: data?.id,
                    entityType: EntityType.PRODUCT,
                    initImageType: ImageType.GALLERY,
                    onRefetch: () => {
                      utils.Product.invalidate();
                    }
                  })
                }
              >
                Chọn ảnh từ thư viện
              </Button>
            </Stack>
          </GridCol>
          <Grid.Col span={6}>
            <Controller
              control={formFields.control}
              name='name'
              render={({ field, formState: { errors } }) => (
                <TextInput
                  {...field}
                  label='Tên sản phẩm'
                  placeholder='Nhập tên sản phẩm'
                  error={errors.name?.message}
                />
              )}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <Controller
              name='subCategoryId'
              control={formFields.control}
              render={({ field, formState: { errors } }) => (
                <Select
                  label='Danh mục'
                  placeholder=' Chọn danh mục'
                  searchable
                  data={categories?.map(category => ({
                    value: category.id,
                    label: category.name + ` (${category.category.name})`
                  }))}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  error={errors.subCategoryId?.message}
                />
              )}
            />
          </Grid.Col>

          <Grid.Col span={6}>
            <Controller
              name='materials'
              control={formFields.control}
              render={({ field, formState: { errors } }) => (
                <MultiSelect
                  label='Nguyên liệu'
                  placeholder='Chọn nguyên liệu'
                  searchable
                  data={materials?.map(material => ({
                    value: material.id,
                    label: material.name
                  }))}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  error={errors.materials?.message}
                />
              )}
            />
          </Grid.Col>

          <Grid.Col span={6}>
            <Controller
              control={formFields.control}
              name='price'
              render={({ field, formState: { errors } }) => (
                <NumberInput
                  thousandSeparator=','
                  hideControls
                  label='Giá tiền'
                  placeholder='Nhập giá tiền'
                  error={errors.price?.message}
                  {...field}
                />
              )}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <Controller
              control={formFields.control}
              name='discount'
              render={({ field, formState: { errors } }) => (
                <NumberInput
                  thousandSeparator=','
                  hideControls
                  label='Giảm giá'
                  placeholder='Nhập giảm giá'
                  error={errors.discount?.message}
                  {...field}
                />
              )}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <Controller
              control={formFields.control}
              name='region'
              render={({ field, formState: { errors } }) => (
                <Select
                  label='Vùng miền'
                  placeholder='Chọn vùng miền'
                  searchable
                  data={seedRegions?.map(region => ({
                    value: region.value,
                    label: region.label
                  }))}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  error={errors.region?.message}
                />
              )}
            />
          </Grid.Col>

          <Grid.Col span={6}>
            <Controller
              control={formFields.control}
              name='availableQuantity'
              render={({ field, formState: { errors } }) => (
                <NumberInput
                  thousandSeparator=','
                  hideControls
                  label='Số lượng khả dụng'
                  placeholder='Nhập Số lượng khả dụng'
                  error={errors.availableQuantity?.message}
                  {...field}
                />
              )}
            />
          </Grid.Col>

          <Grid.Col span={6}>
            <Controller
              control={formFields.control}
              name='soldQuantity'
              defaultValue={0}
              render={({ field, formState: { errors } }) => (
                <NumberInput
                  {...field}
                  thousandSeparator=','
                  hideControls
                  value={field.value ?? 0}
                  onChange={val => field.onChange(val ? Number(val) : 0)}
                  min={0}
                  label='Số lượng đã bán'
                  placeholder='Số lượng đã bán'
                  error={errors.soldQuantity?.message}
                />
              )}
            />
          </Grid.Col>

          <Grid.Col span={6}>
            <Controller
              control={formFields.control}
              name='isActive'
              render={({ field, formState: { errors } }) => (
                <Switch
                  label='Trạng thái (Ẩn / Hiện)'
                  error={errors.isActive?.message}
                  checked={field.value}
                  onChange={event => {
                    const checked = event.target.checked;
                    field.onChange(checked);
                  }}
                  thumbIcon={
                    !!field.value ? (
                      <IconCheck size={12} color='var(--mantine-color-teal-6)' stroke={3} />
                    ) : (
                      <IconX size={12} color='var(--mantine-color-red-6)' stroke={3} />
                    )
                  }
                />
              )}
            />
          </Grid.Col>

          <Grid.Col span={12}>
            <Controller
              control={formFields.control}
              name='tags'
              render={({ field, formState: { errors } }) => (
                <TagsInput {...field} label='Gắn tag cho sản phẩm' placeholder='Gắn tag cho sản phẩm' clearable />
              )}
            />
          </Grid.Col>

          <Grid.Col span={12}>
            <Controller
              control={formFields.control}
              name='description'
              render={({ field, formState: { errors } }) => (
                <Textarea label='Mô tả' placeholder='Nhập mô tả' {...field} />
              )}
            />
          </Grid.Col>

          <Grid.Col span={12}>
            <Text fw={600} size='lg'>
              Mô tả chi tiết
            </Text>
            <Controller
              control={formFields.control}
              name='descriptionDetailJson'
              render={({ field, formState: { errors } }) => (
                <TiptapEditor
                  value={field.value}
                  onChange={value => {
                    field.onChange(value.json);
                    formFields.setValue('descriptionDetailHtml', value.html);
                  }}
                />
              )}
            />
          </Grid.Col>
          <Button type='submit' className='mt-4' loading={formFields.formState.isSubmitting} fullWidth>
            Tạo mới / Cập nhật
          </Button>
        </Grid>
      </form>
    </FormProvider>
  );
}
