'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ActionIcon,
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
import { Dispatch, SetStateAction, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import BButton from '~/components/Button/Button';
import { TiptapEditor } from '~/components/Tiptap/TiptapEditor';
import { createTag } from '~/lib/FuncHandler/generateTag';
import { fileToBase64 } from '~/lib/FuncHandler/handle-file-base64';
import { NotifyError, NotifySuccess } from '~/lib/FuncHandler/toast';
import { productSchema } from '~/lib/ZodSchema/schema';
import { api } from '~/trpc/react';
import { Product } from '~/types/product';

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

export default function CreateProduct({ setOpened }: { setOpened: Dispatch<SetStateAction<boolean>> }) {
  const { data: categories } = api.SubCategory.getAll.useQuery();
  const { data: materials } = api.Material.getAll.useQuery();
  const [imageAddition, setImageAddition] = useState<File[]>([]);
  const [json, setJson] = useState<any>(null);
  const [html, setHtml] = useState<string>('<p>Đang cập nhật</p>');

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    watch
  } = useForm<Product>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      id: '',
      name: '',
      tag: '',
      description: '',
      descriptionDetailJson: {},
      descriptionDetailHtml: '<p>Đang cập nhật</p>',
      discount: 0,
      availableQuantity: 0,
      soldQuantity: 0,
      price: 0,
      thumbnail: undefined,
      gallery: [],
      tags: [],
      isActive: true,
      region: 'Miền Nam',
      subCategoryId: '',
      materials: []
    },
    mode: 'onChange'
  });

  const utils = api.useUtils();
  const mutation = api.Product.create.useMutation({
    onSuccess: () => {
      utils.Product.invalidate();
    },
    onError: e => {
      NotifyError(e.message);
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

        const result = await mutation.mutateAsync({
          ...formDataWithImages,
          tag: createTag(formData.name),
          descriptionDetailJson: json,
          descriptionDetailHtml: html
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
              <TextInput
                radius='md'
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
                {...field}
                radius={'md'}
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

        <Grid.Col span={12}>
          <Text fw={600} size='lg'>
            Mô tả chi tiết
          </Text>
          <TiptapEditor
            value={json}
            onChange={({ json, html }) => {
              setJson(json);
              setHtml(html);
            }}
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
                  : 'Chỉ cho phép các định dạng file: PNG, JPEG, hoặc JPG'
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
        <BButton type='submit' className='mt-4' loading={isSubmitting} fullWidth disabled={!isDirty}>
          Tạo sản phẩm
        </BButton>
      </Grid>
    </form>
  );
}
