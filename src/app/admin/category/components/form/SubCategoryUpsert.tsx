'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Grid, GridCol, Modal, Paper, Select, Stack, Switch, Text, Textarea, TextInput, Title } from '@mantine/core';
import { EntityType } from '@prisma/client';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Controller, FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import ImageRenderGrid from '~/app/admin/images/components/ImageRenderGrid';
import { ImageWithAssociations } from '~/app/admin/images/types/image.types';
import BButton from '~/components/Button/Button';
import ThumbnailUpsert from '~/components/ImageFormUpsert';
import { ModalUpsertSkeleton } from '~/components/ModelUpsertSkeleton';
import { handleUploadFromClient, UploadedImage } from '~/lib/Cloudinary/client';
import { NotifyError, NotifySuccess } from '~/lib/FuncHandler/toast';
import { StatusImage } from '~/shared/schema/image.schema';
import { SubCategoryInput, subCategoryInputSchema } from '~/shared/schema/subCategory.schema';
import { api } from '~/trpc/react';

export default function SubCategoryUpsert({
  subCategoryId,
  setOpened
}: {
  subCategoryId?: string;
  setOpened: Dispatch<SetStateAction<boolean>>;
}) {
  const [imageLibraries, setImageLibraries] = useState<
    | {
        data: ImageWithAssociations[];
        total: number;
        pageInfo: {
          skip: number;
          take: number;
          hasMore: boolean;
        };
      }
    | undefined
  >(undefined);
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
      image: undefined
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
      image: data?.image
        ? {
            id: data?.image?.id,
            publicId: data?.image?.publicId,
            url: data?.image?.url
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
  const connectImageFromLibraryMutation = api.Images.connectedEntity.useMutation({
    onSuccess: () => {
      utils.SubCategory.invalidate();
      NotifySuccess('Cập nhật hình ảnh thành công.');
    },
    onError: e => {
      NotifyError(e.message);
    }
  });
  const onSubmit: SubmitHandler<SubCategoryInput> = async formData => {
    const acceptedFiles = formFields.getValues('image.urlFile');
    const imagePublicId = formFields.getValues('image.publicId');
    let imagesToSave: UploadedImage | undefined = acceptedFiles
      ? await handleUploadFromClient(acceptedFiles, utils, {
          folder: EntityType.SUB_CATEGORY
        })
      : undefined;

    await updateMutation.mutateAsync({
      ...formData,
      image: imagesToSave
        ? {
            ...formData?.image,
            ...imagesToSave,
            status: StatusImage.NEW
          }
        : data?.image?.publicId && !imagePublicId
          ? {
              publicId: data?.image?.publicId,
              status: StatusImage.DELETED
            }
          : undefined
    });
  };

  const [opendLibrary, setOpenLibrary] = useState(false);

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
                          radius='md'
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
                          radius='md'
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
                          radius='md'
                        />
                      )}
                    />
                  </Grid.Col>

                  <Grid.Col span={12}>
                    <Controller
                      name='isActive'
                      control={formFields.control}
                      render={({ field, formState: { errors } }) => (
                        <Paper withBorder p='xs' radius='md'>
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
                  <ThumbnailUpsert nameField='image' size={'100%'} />
                  <BButton
                    variant='outline'
                    size='sm'
                    fullWidth
                    onClick={async () => {
                      const data = await utils.Images.getAllImages.fetch({});
                      if (data && data?.data?.length > 0) setImageLibraries(data);
                      setOpenLibrary(true);
                    }}
                  >
                    Chọn ảnh từ thư viện
                  </BButton>
                </Stack>
              </Grid.Col>
            </Grid>
          </GridCol>
          <GridCol>
            <BButton
              type='submit'
              className='mt-4'
              loading={formFields.formState.isSubmitting}
              fullWidth
              disabled={!formFields.formState.isDirty}
            >
              Tạo mới / Cập nhật
            </BButton>
          </GridCol>
        </Grid>
      </form>
      <Modal
        title={
          <Title order={2} className='font-quicksand'>
            Thư viện hình ảnh
          </Title>
        }
        fullScreen
        opened={opendLibrary}
        onClose={() => setOpenLibrary(false)}
      >
        {opendLibrary && (
          <ImageRenderGrid
            imagesData={imageLibraries}
            isLoading={false}
            refetch={utils.Images.getAllImages.refetch()}
            mode={'library'}
            imageIdConnected={data?.image?.id}
            onConnected={async (imageId, mode) => {
              if (data?.id && imageId) {
                await connectImageFromLibraryMutation.mutateAsync({
                  entityId: data?.id,
                  entityType: EntityType.SUB_CATEGORY,
                  images: [
                    {
                      id: imageId,
                      mode
                    }
                  ]
                });
                return;
              }
              NotifyError('Danh mục hoặc ảnh không hợp lệ.');
            }}
          />
        )}
      </Modal>
    </FormProvider>
  );
}
