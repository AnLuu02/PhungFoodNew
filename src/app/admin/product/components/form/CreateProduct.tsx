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
  TagsInput,
  Text,
  Textarea,
  TextInput
} from '@mantine/core';
import { ProductStatus } from '@prisma/client';
import { IconFile, IconTrash } from '@tabler/icons-react';
import { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Product } from '~/app/Entity/ProductEntity';
import { createTag } from '~/app/lib/utils/func-handler/generateTag';
import { fileToBase64 } from '~/app/lib/utils/func-handler/handle-file-upload';
import { NotifyError, NotifySuccess } from '~/app/lib/utils/func-handler/toast';
import { productSchema } from '~/app/lib/utils/zod/zodShcemaForm';
import { api } from '~/trpc/react';

export const regions = [
  {
    value: 'mien-nam',
    label: 'Miền Nam'
  },
  {
    value: 'mien-tay',
    label: 'Miền Tây'
  },
  {
    value: 'mien-trung',
    label: 'Miền Trung'
  },
  {
    value: 'mien-bac',
    label: 'Miền Bắc'
  }
];

export default function CreateProduct({ setOpened }: { setOpened: any }) {
  const { data: categories } = api.SubCategory.getAll.useQuery();
  const { data: materials, isLoading } = api.Material.getAll.useQuery();
  const [imageAddition, setImageAddition] = useState<File[]>([]);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch
  } = useForm<Product>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      id: '',
      name: '',
      tag: '',
      description: '',
      discount: 0,
      price: 0,
      thumbnail: undefined,
      gallery: [],
      tags: [],
      status: ProductStatus.ACTIVE,
      region: 'Miền Nam',
      subCategoryId: '',
      materials: []
    }
  });
  const utils = api.useUtils();
  const mutation = api.Product.create.useMutation({
    onSuccess: () => {
      utils.Product.invalidate();
    }
  });

  const onSubmit: SubmitHandler<Product> = async formData => {
    try {
      if (formData) {
        const thumbnail_format =
          formData.thumbnail instanceof File
            ? {
                fileName: formData.thumbnail.name,
                base64: (await fileToBase64(formData.thumbnail)) as string
              }
            : undefined;

        const gallery_format =
          formData.gallery &&
          (await Promise.all(
            formData.gallery.map(async (image: any) => ({
              fileName: image?.name || '',
              base64: (await fileToBase64(image)) as string
            }))
          ));

        const formDataWithImages = {
          ...formData,
          thumbnail: thumbnail_format,
          gallery: gallery_format
        };

        let result = await mutation.mutateAsync({
          ...formDataWithImages,
          tag: createTag(formData.name)
        });
        if (result.success) {
          NotifySuccess(result.message);
          setOpened(false);
        } else {
          NotifyError(result.message);
        }
      }
    } catch (error) {
      NotifyError('Đã xảy ra ngoại lệ. Hãy kiểm tra lại.');
    }
  };

  return (
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
              <TextInput {...field} label='Tên sản phẩm' placeholder='Nhập tên sản phẩm' error={errors.name?.message} />
            )}
          />
        </Grid.Col>
        {/* <Grid.Col span={6} hidden>
          <Controller
            control={control}
            name='tag'
            render={({ field }) => (
              <TextInput
                {...field}
                leftSection={<IconTag size={18} stroke={1.5} />}
                label='Tag'
                placeholder='Sẽ tạo tự động'
                error={errors.name?.message}
                readOnly
              />
            )}
          />
        </Grid.Col> */}
        <Grid.Col span={6}>
          <Controller
            name='subCategoryId'
            control={control}
            render={({ field }) => (
              <Select
                label='Danh mục'
                placeholder='Select your category'
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
            name='status'
            render={({ field }) => (
              <Select
                label='Trạng thái'
                placeholder='Hiển thị hay ẩn'
                data={Object.values(ProductStatus)?.map(category => ({
                  value: category,
                  label: category === ProductStatus.ACTIVE ? 'Hiển thị' : 'Tạm ẩn'
                }))}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={errors.subCategoryId?.message}
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
              required: 'File or URL is required',
              validate: file =>
                file instanceof File && ['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)
                  ? true
                  : 'Only PNG, JPEG, or JPG files are allowed'
            }}
            render={({ field }) => (
              <FileInput
                id='thumbnail'
                leftSection={<ActionIcon size='sx' color='gray' variant='transparent' component={IconFile} />}
                label='Ảnh chính'
                placeholder='Choose a file'
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
              required: 'File or URL is required',
              validate: files =>
                files.every(file => ['image/png', 'image/jpeg', 'image/jpg'].includes(file.type))
                  ? true
                  : 'Only PNG, JPEG, or JPG files are allowed'
            }}
            render={({ field }) => (
              <FileInput
                id='gallery'
                leftSection={<ActionIcon size='sx' color='gray' variant='transparent' component={IconFile} />}
                label='Ảnh bổ sung'
                placeholder='Choose a file'
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
        <Button type='submit' className='mt-4 w-full' loading={isSubmitting} fullWidth>
          Tạo sản phẩm
        </Button>
      </Grid>
    </form>
  );
}
