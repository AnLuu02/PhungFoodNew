'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Grid, GridCol, Paper, Select, Stack, Switch, Text, Textarea, TextInput } from '@mantine/core';
import { EntityType, ImageType } from '@prisma/client';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { Controller, FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import ThumbnailUpsert from '~/components/ImageFormUpsert';
import { ModalUpsertSkeleton } from '~/components/ModelUpsertSkeleton';
import { useModalActions } from '~/contexts/ModalContext';
import { handleUploadFromClient, UploadedImage } from '~/lib/Cloudinary/client';
import { NotifyError, NotifySuccess } from '~/lib/FuncHandler/toast';
import { StatusImage } from '~/shared/schema/image.info.schema';
import { SubCategoryInput, subCategoryInputSchema } from '~/shared/schema/subCategory.schema';
import { api } from '~/trpc/react';

export default function SubCategoryUpsert({
  subCategoryId,
  setOpened
}: {
  subCategoryId?: string;
  setOpened: Dispatch<SetStateAction<boolean>>;
}) {
  const { openModal } = useModalActions();
  const queryResult: any = api.SubCategory.getOne.useQuery({ s: subCategoryId || '' }, { enabled: !!subCategoryId });
  const { data, isLoading: isLoadingDataSubCategory } = queryResult;
  const formFields = useForm<SubCategoryInput>({
    resolver: zodResolver(subCategoryInputSchema),
    defaultValues: {
      id: undefined,
      name: '',
      tag: undefined,
      isActive: true,
      description: '',
      categoryId: undefined,
      imageForEntity: undefined
    }
  });

  useEffect(() => {
    formFields.reset({
      id: data?.id,
      name: data?.name,
      isActive: data?.isActive,
      tag: data?.tag,
      description: data?.description || '',
      categoryId: data?.categoryId as string,
      imageForEntity: data?.imageForEntity
        ? {
            ...data?.imageForEntity,
            image: data?.imageForEntity?.image ? { ...data?.imageForEntity?.image } : undefined
          }
        : undefined
    });
  }, [data, formFields.reset]);

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
    const acceptedFiles = formFields.getValues('imageForEntity.image.urlFile');
    const imagePublicId = formFields.getValues('imageForEntity.image.publicId');
    let imagesToSave: UploadedImage | undefined = acceptedFiles
      ? await handleUploadFromClient(acceptedFiles, utils, {
          folder: EntityType.CATEGORY + '/' + ImageType.THUMBNAIL
        })
      : undefined;
    await updateMutation.mutateAsync({
      ...formData,
      imageForEntity: imagesToSave
        ? {
            id: formData?.imageForEntity?.id,
            altText: formData?.imageForEntity?.altText || 'Ảnh của danh mục ' + (formData?.name || ''),
            type: formData?.imageForEntity?.type || ImageType.THUMBNAIL,
            entityType: formData?.imageForEntity?.entityType || EntityType.CATEGORY,
            status: StatusImage.NEW,
            image: {
              ...imagesToSave,
              id: undefined,
              altText: formData?.imageForEntity?.altText || 'Ảnh của danh mục ' + (formData?.name || ''),
              type: formData?.imageForEntity?.type || ImageType.THUMBNAIL
            }
          }
        : data?.imageForEntity?.id && !imagePublicId
          ? {
              id: data?.imageForEntity?.id,
              status: StatusImage.DELETED
            }
          : undefined
    });
  };

  if (isLoadingDataSubCategory) return <ModalUpsertSkeleton />;

  return (
    <FormProvider {...formFields}>
      <form onSubmit={formFields.handleSubmit(onSubmit)}>
        <Grid>
          <GridCol span={12}>
            <Grid gutter='md'>
              <Grid.Col span={{ base: 12, md: 8 }}>
                <Grid gutter='sm'>
                  <Grid.Col span={12}>
                    <Controller
                      name='categoryId'
                      control={formFields.control}
                      render={({ field, formState: { errors } }) => (
                        <Select
                          disabled={isLoading}
                          label='Danh mục chính'
                          placeholder='Chọn danh mục cha'
                          data={categoryData?.map(c => ({ value: c.id, label: c.name }))}
                          {...field}
                          error={errors.categoryId?.message}
                        />
                      )}
                    />
                  </Grid.Col>

                  <Grid.Col span={12}>
                    <Controller
                      name='name'
                      control={formFields.control}
                      render={({ field, formState: { errors } }) => (
                        <TextInput
                          {...field}
                          required
                          label='Tên danh mục'
                          placeholder='Ví dụ: Đồ gia dụng'
                          error={errors.name?.message}
                        />
                      )}
                    />
                  </Grid.Col>

                  <Grid.Col span={12}>
                    <Controller
                      name='description'
                      control={formFields.control}
                      render={({ field, formState: { errors } }) => (
                        <Textarea
                          label='Mô tả'
                          placeholder='Mô tả ngắn về danh mục này...'
                          rows={3}
                          {...field}
                          error={errors.description?.message}
                        />
                      )}
                    />
                  </Grid.Col>

                  <Grid.Col span={12}>
                    <Controller
                      name='isActive'
                      control={formFields.control}
                      render={({ field, formState: { errors } }) => (
                        <Paper withBorder p='xs'>
                          <Switch
                            label='Trạng thái hoạt động'
                            description='Cho phép hiển thị danh mục này ngoài cửa hàng'
                            checked={field.value}
                            onChange={e => field.onChange(e.currentTarget.checked)}
                          />
                        </Paper>
                      )}
                    />
                  </Grid.Col>
                </Grid>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 4 }}>
                <Text size='sm' fw={500} mb={4}>
                  Ảnh đại diện
                </Text>
                <Stack>
                  <ThumbnailUpsert nameField='imageForEntity.image' size={'100%'} />
                  <Button
                    variant='outline'
                    size='sm'
                    fullWidth
                    onClick={async () =>
                      openModal('images_library', undefined, {
                        entityId: data?.id,
                        entityType: EntityType.CATEGORY,
                        initImageType: ImageType.THUMBNAIL,
                        onRefetch: () => {
                          utils.SubCategory.invalidate();
                        }
                      })
                    }
                  >
                    Chọn ảnh từ thư viện
                  </Button>
                </Stack>
              </Grid.Col>
            </Grid>
          </GridCol>
          <GridCol>
            <Button
              type='submit'
              className='mt-4'
              loading={formFields.formState.isSubmitting}
              fullWidth
              disabled={!formFields.formState.isDirty}
            >
              Tạo mới / Cập nhật
            </Button>
          </GridCol>
        </Grid>
      </form>
    </FormProvider>
  );
}
