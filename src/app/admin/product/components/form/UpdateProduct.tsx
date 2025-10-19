'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ActionIcon,
  Button,
  FileInput,
  Flex,
  Grid,
  GridCol,
  Image,
  MultiSelect,
  NumberInput,
  Paper,
  Select,
  Switch,
  TagsInput,
  Text,
  Textarea,
  TextInput
} from '@mantine/core';
import { IconCheck, IconFile, IconTrash, IconX } from '@tabler/icons-react';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import LoadingSpiner from '~/components/Loading/LoadingSpiner';
import { TiptapEditor } from '~/components/Tiptap/TiptapEditor';
import { UserRole } from '~/constants';
import { createTag } from '~/lib/func-handler/generateTag';
import { fileToBase64, vercelBlobToFile } from '~/lib/func-handler/handle-file-base64';
import { NotifyError, NotifySuccess } from '~/lib/func-handler/toast';
import { LocalImageType } from '~/lib/zod/EnumType';
import { productSchema } from '~/lib/zod/zodShcemaForm';
import { api } from '~/trpc/react';
import { Product } from '~/types/product';
import { regions } from './CreateProduct';

export default function UpdateProduct({
  productId,
  setOpened
}: {
  productId: string;
  setOpened: Dispatch<SetStateAction<boolean>>;
}) {
  const [loading, setLoading] = useState(false);
  const { data: categories } = api.SubCategory.getAll.useQuery();
  const { data: materials } = api.Material.getAll.useQuery();

  const { data } = api.Product.getOne.useQuery(
    { s: productId || '', userRole: UserRole.ADMIN },
    { enabled: !!productId }
  );

  const [imageAddition, setImageAddition] = useState<File[]>([]);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    reset,
    watch,
    setValue
  } = useForm<Product>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      id: '',
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
    setLoading(true);
    if (data) {
      const thumnailDb = data?.images?.find(image => image.type === LocalImageType.THUMBNAIL)?.url || '';
      const galleries =
        data?.images?.filter(image => image.type === LocalImageType.GALLERY).map(image => image.url) || [];
      Promise.all([
        thumnailDb && thumnailDb !== '' && vercelBlobToFile(thumnailDb as string),
        galleries && galleries?.length > 0 ? vercelBlobToFile(galleries as string[], { type: 'multiple' }) : []
      ])
        .then(([thumbnail, images]) => {
          thumbnail instanceof File && setValue('thumbnail', thumbnail);
          if (Array.isArray(images) && images.every(img => img instanceof File)) {
            setValue('gallery', images);
            setImageAddition(images);
          }
        })
        .finally(() => {
          setLoading(false);
        });
      reset({
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
        descriptionDetailHtml: data?.descriptionDetailHtml || '<p>Đang cập nhật</p>'
      });
    }
  }, [data, reset]);

  useEffect(() => {
    setValue('gallery', imageAddition as File[]);
  }, [imageAddition]);

  const utils = api.useUtils();
  const updateMutation = api.Product.update.useMutation({
    onSuccess: () => {
      utils.Product.invalidate();
    },
    onError: e => {
      NotifyError(e.message);
    }
  });

  const onSubmit: SubmitHandler<Product> = async formData => {
    try {
      if (productId) {
        const thumbnail_format =
          formData.thumbnail &&
          formData.thumbnail instanceof File &&
          (await Promise.resolve({
            fileName: formData?.thumbnail?.name || '',
            base64: (await fileToBase64(formData.thumbnail)) as string
          }));
        const images_format =
          formData.gallery && formData.gallery?.length > 0
            ? await Promise?.all(
                formData.gallery?.map(async (image: any) => {
                  return {
                    fileName: image.name,
                    base64: (await fileToBase64(image)) as string
                  };
                })
              )
            : [];

        const formDataWithImageUrlAsString = {
          ...formData,
          tag: createTag(formData.name),
          thumbnail: thumbnail_format as any,
          gallery: images_format as any
        };
        const result = await updateMutation.mutateAsync({
          ...formDataWithImageUrlAsString,
          descriptionDetailJson: formData.descriptionDetailJson,
          descriptionDetailHtml: formData.descriptionDetailHtml
        });
        if (result.code === 'OK') {
          NotifySuccess(result.message);
          setOpened(false);
        } else {
          NotifyError(result.message);
        }
      }
    } catch {
      NotifyError('Đã xảy ra ngoại lệ. Hãy kiểm tra lại.');
    }
  };

  return loading ? (
    <LoadingSpiner />
  ) : (
    <form onSubmit={handleSubmit(onSubmit)} className='w-full'>
      <Grid>
        <GridCol span={6}>
          <Text size='xl' fw={700}>
            Ảnh chính
          </Text>
          <Flex align={'center'} gap={'xs'}>
            {watch('thumbnail') && (
              <Paper
                withBorder
                radius={'md'}
                w={100}
                h={100}
                styles={{
                  root: {
                    borderStyle: 'dashed',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    gap: '2px'
                  }
                }}
                pos={'relative'}
              >
                <Image
                  loading='lazy'
                  src={
                    watch('thumbnail') && watch('thumbnail') instanceof File
                      ? URL.createObjectURL(watch('thumbnail') as unknown as File)
                      : watch('thumbnail')
                  }
                  alt='Product Image'
                  className='mb-4'
                  w={'100%'}
                  h={'100%'}
                />
                <IconTrash color='red' className='absolute right-0 top-0' />
              </Paper>
            )}
            <label htmlFor='thumbnail'>
              <Paper
                withBorder
                radius={'md'}
                w={100}
                h={100}
                styles={{
                  root: {
                    borderStyle: 'dashed',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }
                }}
              >
                <Text size='xl' fw={200}>
                  +
                </Text>
                <Text size='xs' fw={200}>
                  Tải lên
                </Text>
              </Paper>
            </label>
          </Flex>
        </GridCol>
        <GridCol span={12}>
          <Text size='xl' fw={700}>
            Ảnh bổ sung
          </Text>
          <Flex align={'center'} gap={'xs'}>
            {Array.isArray(imageAddition) &&
              imageAddition!.map((image, index) => {
                const imageUrl = image instanceof File ? URL.createObjectURL(image) : image;
                return (
                  <Paper
                    withBorder
                    radius={'md'}
                    w={100}
                    h={100}
                    styles={{
                      root: {
                        borderStyle: 'dashed',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        gap: '2px',
                        overflow: 'hidden'
                      }
                    }}
                    pos={'relative'}
                  >
                    <Image
                      loading='lazy'
                      key={index}
                      src={imageUrl}
                      alt='Product Image'
                      className='mb-4'
                      onLoad={() => {
                        if (image instanceof File) URL.revokeObjectURL(imageUrl);
                      }}
                      w={'100%'}
                      h={'100%'}
                    />
                    <IconTrash
                      color='red'
                      onClick={() => {
                        const newImageAddition = imageAddition!.filter((_, i) => i !== index);
                        setImageAddition(newImageAddition);
                      }}
                      className='absolute right-0 top-0'
                    />
                  </Paper>
                );
              })}
            <label htmlFor='gallery'>
              <Paper
                withBorder
                radius={'md'}
                w={100}
                h={100}
                styles={{
                  root: {
                    borderStyle: 'dashed',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }
                }}
              >
                <Text size='xl' fw={200}>
                  +
                </Text>
                <Text size='xs' fw={200}>
                  Tải lên
                </Text>
              </Paper>
            </label>
          </Flex>
        </GridCol>
        <Grid.Col span={6}>
          <Controller
            control={control}
            name='name'
            render={({ field }) => (
              <TextInput
                {...field}
                radius='md'
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
            control={control}
            render={({ field }) => (
              <Select
                label='Danh mục'
                radius='md'
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
            control={control}
            render={({ field }) => (
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
            control={control}
            name='price'
            render={({ field }) => (
              <NumberInput
                radius={'md'}
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
            control={control}
            name='discount'
            render={({ field }) => (
              <NumberInput
                radius={'md'}
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
            control={control}
            name='region'
            render={({ field }) => (
              <Select
                label='Vùng miền'
                radius='md'
                placeholder='Chọn vùng miền'
                searchable
                data={regions?.map(region => ({
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
            control={control}
            name='availableQuantity'
            render={({ field }) => (
              <NumberInput
                radius={'md'}
                thousandSeparator=','
                hideControls
                label='Số lượng khả dụng'
                placeholder='Nhập Số lượng khả dụng'
                error={errors.discount?.message}
                {...field}
              />
            )}
          />
        </Grid.Col>

        <Grid.Col span={6}>
          <Controller
            control={control}
            name='soldQuantity'
            defaultValue={0}
            render={({ field }) => (
              <NumberInput
                radius={'md'}
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
            control={control}
            name='isActive'
            render={({ field }) => (
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
            control={control}
            name='tags'
            render={({ field }) => (
              <TagsInput {...field} label='Gắn tag cho sản phẩm' placeholder='Gắn tag cho sản phẩm' clearable />
            )}
          />
        </Grid.Col>

        <Grid.Col span={12}>
          <Controller
            control={control}
            name='description'
            render={({ field }) => <Textarea label='Mô tả' placeholder='Nhập mô tả' {...field} />}
          />
        </Grid.Col>
        <Grid.Col span={12} hidden>
          <Controller
            name='thumbnail'
            control={control}
            rules={{
              required: 'File hoặc URL là bắt buộc',
              validate: file =>
                file instanceof File && ['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)
                  ? true
                  : 'Only PNG, JPEG, or JPG files are allowed'
            }}
            render={({ field }) => (
              <FileInput
                id='thumbnail'
                leftSection={<ActionIcon size='xs' color='gray' variant='transparent' component={IconFile} />}
                label='Ảnh chính'
                placeholder='Chọn một file'
                leftSectionPointerEvents='none'
                value={field.value as unknown as File}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={errors.thumbnail?.message}
                accept='image/png,image/jpeg,image/jpg'
              />
            )}
          />
        </Grid.Col>
        <Grid.Col span={12} hidden>
          <Controller
            name='gallery'
            control={control}
            rules={{
              required: 'File hoặc URL là bắt buộc',
              validate: files =>
                files.every(file => ['image/png', 'image/jpeg', 'image/jpg'].includes(file.type))
                  ? true
                  : 'Only PNG, JPEG, or JPG files are allowed'
            }}
            render={({ field }) => (
              <FileInput
                id='gallery'
                leftSection={<ActionIcon size='xs' color='gray' variant='transparent' component={IconFile} />}
                label='Ảnh bổ sung'
                placeholder='Chọn một file'
                leftSectionPointerEvents='none'
                value={field.value as unknown as File[]}
                onChange={value => {
                  field.onChange([...imageAddition, ...value]);
                  setImageAddition(valueCurrent => [...valueCurrent, ...value]);
                }}
                onBlur={field.onBlur}
                error={errors.thumbnail?.message}
                accept='image/png,image/jpeg,image/jpg'
                multiple
              />
            )}
          />
        </Grid.Col>
        <Grid.Col span={12}>
          <Text fw={600} size='lg'>
            Mô tả chi tiết
          </Text>
          <Controller
            control={control}
            name='descriptionDetailJson'
            render={({ field }) => (
              <TiptapEditor
                value={field.value}
                onChange={value => {
                  field.onChange(value.json);
                  setValue('descriptionDetailHtml', value.html);
                }}
              />
            )}
          />
        </Grid.Col>
        <Button type='submit' className='mt-4 w-full' loading={isSubmitting} fullWidth>
          Cập nhật
        </Button>
      </Grid>
    </form>
  );
}
