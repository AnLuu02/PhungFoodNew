'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { ActionIcon, FileInput, Grid, GridCol, Image, Paper, Select, Switch, Textarea, TextInput } from '@mantine/core';
import { IconFile, IconTrash } from '@tabler/icons-react';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import BButton from '~/components/Button/Button';
import LoadingSpiner from '~/components/Loading/LoadingSpiner';
import { fileToBase64, vercelBlobToFile } from '~/lib/FuncHandler/handle-file-base64';
import { NotifyError, NotifySuccess } from '~/lib/FuncHandler/toast';
import { SubCategoryInput, subCategoryInputSchema } from '~/shared/schema/subCategory.schema';
import { api } from '~/trpc/react';

export default function SubCategoryUpsert({
  subCategoryId,
  setOpened
}: {
  subCategoryId?: string;
  setOpened: Dispatch<SetStateAction<boolean>>;
}) {
  const queryResult: any = api.SubCategory.getOne.useQuery({ s: subCategoryId || '' }, { enabled: !!subCategoryId });
  const { data, isLoading: isLoadingDataSubCategory } = queryResult;
  const [loading, setLoading] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    reset,
    watch,
    setValue
  } = useForm<SubCategoryInput>({
    resolver: zodResolver(subCategoryInputSchema),
    defaultValues: {
      id: undefined,
      name: '',
      tag: undefined,
      isActive: true,
      description: '',
      categoryId: undefined,
      image: undefined
    }
  });

  useEffect(() => {
    setLoading(true);
    if (data && data?.image?.url && data?.image?.url !== '') {
      vercelBlobToFile(data?.image?.url as string)
        .then(file => {
          setValue('image.url', file as File);
        })
        .catch(err => {
          new Error(err);
        })
        .finally(() => setLoading(false));
    } else {
      setValue('image.url', watch('image.url'));
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
  const updateMutation = api.SubCategory.upsert.useMutation({
    onSuccess: () => {
      utils.SubCategory.invalidate();
      NotifySuccess('Chúc mừng bạn đã thao tác thành công.');
      setOpened(false);
    },
    onError: e => {
      NotifyError(e.message);
    }
  });

  const onSubmit: SubmitHandler<SubCategoryInput> = async formData => {
    const file = (formData?.image?.url as File) ?? undefined;
    const base64 = file ? await fileToBase64(file) : '';
    const formDataWithImageUrlAsString = {
      ...formData,
      image: file
        ? {
            fileName: file?.name || '',
            base64: base64 as string
          }
        : undefined
    };
    await updateMutation.mutateAsync(formDataWithImageUrlAsString);
  };

  if (isLoadingDataSubCategory || loading) return <LoadingSpiner />;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid>
        <GridCol span={5}>
          <Paper
            withBorder
            radius={'md'}
            w={300}
            h={300}
            styles={{
              root: {
                overflow: 'hidden',
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
                watch('image.url') instanceof File
                  ? URL.createObjectURL(watch('image.url') as File)
                  : watch('image.url') || '/images/jpg/empty-300x240.jpg'
              }
              alt='Product Image'
              className='mb-4 h-full w-full'
            />
            {watch('image.url') && (
              <IconTrash
                color='red'
                width={40}
                height={40}
                className='absolute right-0 top-0 hover:opacity-40'
                onClick={() => {
                  setValue('image.url', null, {
                    shouldDirty: true
                  });
                  setValue('image', undefined, {
                    shouldDirty: true
                  });
                }}
              />
            )}
          </Paper>
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
                name='image.url'
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
                    error={errors.image?.message}
                    accept='image/png,image/jpeg,image/jpg'
                  />
                )}
              />
            </GridCol>
          </Grid>
        </GridCol>
        <GridCol>
          <BButton type='submit' className='mt-4' loading={isSubmitting} fullWidth disabled={!isDirty}>
            Tạo mới / Cập nhật
          </BButton>
        </GridCol>
      </Grid>
    </form>
  );
}
