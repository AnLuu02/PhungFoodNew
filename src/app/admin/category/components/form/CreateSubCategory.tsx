'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ActionIcon,
  Button,
  FileInput,
  Grid,
  GridCol,
  Image,
  Select,
  Switch,
  Textarea,
  TextInput
} from '@mantine/core';
import { IconFile } from '@tabler/icons-react';
import type { Dispatch, SetStateAction } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { createTag } from '~/lib/func-handler/generateTag';
import { fileToBase64 } from '~/lib/func-handler/handle-file-base64';
import { NotifyError, NotifySuccess } from '~/lib/func-handler/toast';
import { subCategorySchema } from '~/lib/zod/zodShcemaForm';
import { api } from '~/trpc/react';
import { SubCategory } from '~/types/category';

export default function CreateSubCategory({ setOpened }: { setOpened: Dispatch<SetStateAction<boolean>> }) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    watch
  } = useForm<SubCategory>({
    resolver: zodResolver(subCategorySchema),
    defaultValues: {
      id: '',
      name: '',
      isActive: true,
      tag: '',
      description: '',
      categoryId: '',
      thumbnail: undefined
    }
  });

  const { data: categoryData, isLoading } = api.Category.getAll.useQuery();
  const utils = api.useUtils();
  const mutation = api.SubCategory.create.useMutation({
    onSuccess: () => {
      utils.SubCategory.invalidate();
    }
  });

  const onSubmit: SubmitHandler<SubCategory> = async formData => {
    try {
      if (formData) {
        const file = formData?.thumbnail?.url as File;
        const fileName = file?.name || '';
        const base64 = file ? await fileToBase64(file) : '';
        const result = await mutation.mutateAsync({
          ...formData,
          tag: createTag(formData.name),
          thumbnail: {
            fileName: fileName as string,
            base64: base64 as string
          }
        });
        if (result.code === 'OK') {
          NotifySuccess(result.message);
          setOpened(false);
        } else {
          NotifyError(result.message);
        }
      }
    } catch {
      NotifyError('Error created SubCategory');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid>
        <GridCol span={5}>
          <Image
            loading='lazy'
            src={
              watch('thumbnail.url') && watch('thumbnail.url') instanceof File
                ? URL.createObjectURL(watch('thumbnail.url') as File)
                : watch('thumbnail.url') || '/images/jpg/empty-300x240.jpg'
            }
            alt='Product Image'
            className='mb-4'
          />
          <Controller
            name='thumbnail.url'
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
                leftSection={<ActionIcon size='xs' color='gray' variant='transparent' component={IconFile} />}
                placeholder='Chọn một file'
                leftSectionPointerEvents='none'
                {...field}
                value={field.value as File}
                error={errors.thumbnail?.url?.message}
                accept='image/png,image/jpeg,image/jpg'
              />
            )}
          />
        </GridCol>
        <GridCol span={7}>
          <Grid gutter='md'>
            <Grid.Col span={12}>
              <Controller
                name='categoryId'
                control={control}
                render={({ field }) => (
                  <Select
                    disabled={isLoading}
                    searchable
                    label='Danh mục'
                    placeholder='Chọn danh mục'
                    data={categoryData?.map(category => ({ value: category.id, label: category.name }))}
                    {...field}
                    error={errors.categoryId?.message}
                  />
                )}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <Controller
                control={control}
                name='name'
                render={({ field }) => (
                  <TextInput
                    {...field}
                    size='sm'
                    required
                    label='Tên danh mục'
                    placeholder='Nhập tên danh mục'
                    error={errors.name?.message}
                  />
                )}
              />
            </Grid.Col>

            <Grid.Col span={12}>
              <Controller
                control={control}
                name='description'
                render={({ field }) => (
                  <Textarea
                    size='sm'
                    label='Mô tả'
                    placeholder='Nhập mô tả'
                    error={errors.description?.message}
                    {...field}
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
                    checked={field.value}
                    onChange={event => field.onChange(event.currentTarget.checked)}
                    onBlur={field.onBlur}
                    name={field.name}
                    size='sm'
                    label='Tình trạng'
                  />
                )}
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <Button type='submit' className='mt-4 w-full' loading={isSubmitting} fullWidth disabled={!isDirty}>
                Tạo mới
              </Button>
            </Grid.Col>
          </Grid>
        </GridCol>
      </Grid>
    </form>
  );
}
