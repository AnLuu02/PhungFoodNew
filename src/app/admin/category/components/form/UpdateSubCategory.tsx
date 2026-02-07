'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { ActionIcon, FileInput, Grid, GridCol, Image, Select, Switch, Textarea, TextInput } from '@mantine/core';
import { IconFile } from '@tabler/icons-react';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import BButton from '~/components/Button/Button';
import LoadingSpiner from '~/components/Loading/LoadingSpiner';
import { createTag } from '~/lib/FuncHandler/generateTag';
import { fileToBase64, vercelBlobToFile } from '~/lib/FuncHandler/handle-file-base64';
import { NotifyError, NotifySuccess } from '~/lib/FuncHandler/toast';
import { api } from '~/trpc/react';
import { SubCategoryClientSchema, SubCategoryClientType } from '~/types';

export default function UpdateSubCategory({
  subCategoryId,
  setOpened
}: {
  subCategoryId: string;
  setOpened: Dispatch<SetStateAction<boolean>>;
}) {
  const queryResult = api.SubCategory.getOne.useQuery({ s: subCategoryId || '' }, { enabled: !!subCategoryId });
  const { data, isLoading: isLoadingDataSubCategory } = queryResult;
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    reset,
    watch,
    setValue
  } = useForm<SubCategoryClientType>({
    resolver: zodResolver(SubCategoryClientSchema),
    defaultValues: {
      id: '',
      name: '',
      tag: '',
      isActive: true,
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
      isActive: data?.isActive,
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
    },
    onError: e => {
      NotifyError(e.message);
    }
  });

  const onSubmit: SubmitHandler<SubCategoryClientType> = async formData => {
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
      const result = await updateMutation.mutateAsync({
        ...formDataWithImageUrlAsString,
        tag: createTag(formDataWithImageUrlAsString.name)
      });
      if (result.code === 'OK') {
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
                    radius='md'
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
                    radius={'md'}
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
                    leftSection={<ActionIcon size='xs' color='gray' variant='transparent' component={IconFile} />}
                    label='Ảnh chính'
                    placeholder='Chọn một file'
                    leftSectionPointerEvents='none'
                    {...field}
                    error={errors.thumbnail?.message}
                    accept='image/png,image/jpeg,image/jpg'
                  />
                )}
              />
            </GridCol>
          </Grid>
        </GridCol>
        <GridCol>
          <BButton type='submit' className='mt-4' loading={isSubmitting} fullWidth disabled={!isDirty}>
            Cập nhật
          </BButton>
        </GridCol>
      </Grid>
    </form>
  );
}
