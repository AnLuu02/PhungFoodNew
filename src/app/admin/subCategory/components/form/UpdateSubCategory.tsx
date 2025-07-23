'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { ActionIcon, Button, FileInput, Grid, GridCol, Image, Select, Textarea, TextInput } from '@mantine/core';
import { IconFile } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import LoadingSpiner from '~/components/Loading/LoadingSpiner';
import { createTag } from '~/lib/func-handler/generateTag';
import { fileToBase64, vercelBlobToFile } from '~/lib/func-handler/handle-file-upload';
import { NotifyError, NotifySuccess } from '~/lib/func-handler/toast';
import { subCategorySchema } from '~/lib/zod/zodShcemaForm';
import { api } from '~/trpc/react';
import { SubCategory } from '~/types/subCategory';

export default function UpdateSubCategory({ subCategoryId, setOpened }: { subCategoryId: string; setOpened: any }) {
  const queryResult: any = subCategoryId ? api.SubCategory.getOne.useQuery({ s: subCategoryId || '' }) : { data: null };
  const { data, isLoading: isLoadingDataSubCategory } = queryResult;
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue
  } = useForm<SubCategory>({
    resolver: zodResolver(subCategorySchema),
    defaultValues: {
      id: '',
      name: '',
      tag: '',
      description: '',
      categoryId: '',
      thumbnail: undefined
    }
  });

  useEffect(() => {
    setLoading(true);
    if (data && data?.image?.url && data?.image?.url !== '') {
      vercelBlobToFile(data?.image?.url as string)
        .then(file => {
          setValue('thumbnail.url', file as File);
        })
        .catch(err => {
          new Error(err);
        })
        .finally(() => setLoading(false));
    } else {
      setValue('thumbnail.url', watch('thumbnail.url'));
      setLoading(false);
    }
    reset({
      id: data?.id,
      name: data?.name,
      tag: data?.tag,
      description: data?.description || '',
      categoryId: data?.categoryId as string
    });
  }, [data, reset]);
  const { data: categoryData, isLoading } = api.Category.getAll.useQuery();

  const utils = api.useUtils();
  const updateMutation = api.SubCategory.update.useMutation({
    onSuccess: () => {
      utils.SubCategory.invalidate();
    }
  });

  const onSubmit: SubmitHandler<SubCategory> = async formData => {
    if (subCategoryId) {
      const file = (formData?.thumbnail?.url as File) ?? undefined;
      const fileName = file ? file?.name : '';
      const base64 = file ? await fileToBase64(file) : '';
      const formDataWithImageUrlAsString = {
        ...formData,
        thumbnail: {
          fileName: fileName as string,
          base64: base64 as string
        }
      };
      let result = await updateMutation.mutateAsync({
        ...formDataWithImageUrlAsString,
        tag: createTag(formDataWithImageUrlAsString.name)
      });
      if (result.success) {
        NotifySuccess(result.message);
        setOpened(false);
      } else {
        NotifyError(result.message);
      }
    }
  };

  if (isLoadingDataSubCategory || loading) return <LoadingSpiner />;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid>
        <GridCol span={5}>
          <Image
            loading='lazy'
            src={
              watch('thumbnail.url') instanceof File
                ? URL.createObjectURL(watch('thumbnail.url') as File)
                : watch('thumbnail.url') || '/images/jpg/empty-300x240.jpg'
            }
            alt='Product Image'
            className='mb-4'
          />
        </GridCol>
        <GridCol span={7}>
          <Grid gutter='md'>
            <GridCol span={12}>
              <Controller
                name='categoryId'
                control={control}
                render={({ field }) => (
                  <Select
                    disabled={isLoading}
                    label='Danh mục chính'
                    placeholder='Danh mục chính không được để trống'
                    data={categoryData?.map(category => ({ value: category.id, label: category.name }))}
                    {...field}
                    error={errors.categoryId?.message}
                  />
                )}
              />
            </GridCol>
            <GridCol span={6}>
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
            </GridCol>

            <GridCol span={12}>
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
            </GridCol>
            <GridCol span={12}>
              <Controller
                name='thumbnail.url'
                control={control}
                rules={{
                  validate: file =>
                    file && ['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)
                      ? true
                      : 'Only PNG, JPEG, or JPG files are allowed'
                }}
                render={({ field }) => (
                  <FileInput
                    leftSection={<ActionIcon size='sx' color='gray' variant='transparent' component={IconFile} />}
                    label='Ảnh chính'
                    placeholder='Choose a file'
                    leftSectionPointerEvents='none'
                    {...field}
                    error={errors.thumbnail?.message}
                    accept='image/png,image/jpeg,image/jpg'
                  />
                )}
              />
            </GridCol>
          </Grid>
          <GridCol>
            <Button type='submit' className='mt-4 w-full' loading={isSubmitting} fullWidth>
              Cập nhật
            </Button>
          </GridCol>
        </GridCol>
      </Grid>
    </form>
  );
}
