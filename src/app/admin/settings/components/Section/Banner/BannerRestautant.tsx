'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Badge, Flex, Group, Paper, Stack, Switch } from '@mantine/core';
import { EntityType, ImageType } from '@prisma/client';
import { IconPlus } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { Controller, FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import BButton from '~/components/Button/Button';
import { handleUploadFromClient, uploadMultipleToCloudinaryFromClient } from '~/lib/Cloudinary/client';
import { NotifyError, NotifySuccess, NotifyWarning } from '~/lib/FuncHandler/toast';
import { ImageFromDb, StatusImage } from '~/shared/schema/image.schema';
import { BannerInput, bannerInputSchema } from '~/shared/schema/restaurant.banner.schema';
import { api } from '~/trpc/react';
import BannerInputSection from './BannerInput';
import { CarouselGallery } from './CarouselGallery';
import ListBannerTemplate from './ListBannerTemplate';
export const bannerdefaultValues = {
  id: undefined,
  isActive: false,
  startDate: undefined,
  endDate: undefined,
  banner1: {
    url: undefined,
    urlFile: undefined,
    publicId: ''
  },
  banner2: {
    url: undefined,
    urlFile: undefined,
    publicId: ''
  },
  gallery: undefined,
  galleryInput: null,
  restaurantId: undefined
};
export default function BannerManagement({ restaurantId }: { restaurantId: string }) {
  const [galleryDeleted, setGalleryDeleted] = useState<string[]>([]);
  const [activeBanner, setActiveBanner] = useState<any>(null);
  const formFields = useForm<BannerInput>({
    resolver: zodResolver(bannerInputSchema),
    defaultValues: bannerdefaultValues
  });
  const utils = api.useUtils();
  const mutationUpsert = api.Restaurant.upsertBanner.useMutation({
    onSuccess: () => {
      NotifySuccess('Chúc mừng bạn đã thao tác thành công.');
      formFields.reset(bannerdefaultValues);
      utils.Restaurant.getAllBanner.invalidate();
      setActiveBanner(null);
    },
    onError: e => {
      NotifyError(e.message);
    }
  });
  useEffect(() => {
    if (activeBanner) {
      const { bannerFromDb, galleryFromDb } =
        activeBanner && Array.isArray(activeBanner?.images)
          ? activeBanner?.images?.reduce(
              (
                acc: {
                  bannerFromDb: ImageFromDb[];
                  galleryFromDb: ImageFromDb[];
                },
                item: ImageFromDb
              ) => {
                item?.type === ImageType.BANNER && acc.bannerFromDb?.push(item);
                item?.type === ImageType.GALLERY && acc.galleryFromDb?.push(item);
                return acc;
              },
              { bannerFromDb: [], galleryFromDb: [] }
            )
          : { bannerFromDb: [], galleryFromDb: [] };
      formFields.reset({
        id: activeBanner.id,
        startDate: activeBanner.startDate || new Date(),
        endDate: activeBanner.endDate || new Date(),
        isActive: activeBanner.isActive,
        restaurantId,
        galleryInput: null,
        banner1:
          bannerFromDb && bannerFromDb?.length > 0
            ? { ...bannerFromDb?.[0], id: bannerFromDb?.[0]?.id || '' }
            : undefined,
        banner2:
          bannerFromDb && bannerFromDb?.length > 1
            ? { ...bannerFromDb?.[1], id: bannerFromDb?.[1]?.id || '' }
            : undefined,
        gallery:
          galleryFromDb && galleryFromDb?.length > 0
            ? galleryFromDb?.map((item: ImageFromDb) => ({
                ...item,
                id: item?.id || ''
              }))
            : undefined
      });
    }
  }, [activeBanner]);

  const onSubmit: SubmitHandler<BannerInput> = async formData => {
    const banner_1_form = formFields.getValues('banner1');
    const banner_2_form = formFields.getValues('banner2');
    const gallery_input = formFields.getValues('galleryInput');
    const [banner_1_ToSave, banner_2_ToSave, gallery_ToSave] = await Promise.all([
      banner_1_form?.urlFile
        ? handleUploadFromClient(banner_1_form?.urlFile, utils, {
            folder: EntityType.RESTAURANT + '/' + ImageType.BANNER
          })
        : undefined,
      banner_2_form?.urlFile
        ? handleUploadFromClient(banner_2_form?.urlFile, utils, {
            folder: EntityType.RESTAURANT + '/' + ImageType.BANNER
          })
        : undefined,
      gallery_input && gallery_input?.length > 0
        ? uploadMultipleToCloudinaryFromClient(gallery_input, utils, {
            folder: EntityType.RESTAURANT + '/' + ImageType.GALLERY
          })
        : undefined
    ]);
    const { bannerFromDb, galleryFromDb } =
      activeBanner && Array.isArray(activeBanner?.images)
        ? activeBanner?.images?.reduce(
            (
              acc: {
                bannerFromDb: ImageFromDb[];
                galleryFromDb: ImageFromDb[];
              },
              item: ImageFromDb
            ) => {
              item?.type === ImageType.BANNER && acc.bannerFromDb?.push(item);
              item?.type === ImageType.GALLERY && acc.galleryFromDb?.push(item);
              return acc;
            },
            { bannerFromDb: [], galleryFromDb: [] }
          )
        : { bannerFromDb: [], galleryFromDb: [] };

    const imageReq = [
      ...(banner_1_ToSave
        ? [
            {
              ...(formData?.banner1 ?? {}),
              ...banner_1_ToSave,
              id: undefined,
              type: ImageType.BANNER,
              altText: `Banner 1 của nhà hàng`,
              status: StatusImage.NEW
            },
            ...(bannerFromDb && bannerFromDb?.length > 0
              ? [
                  {
                    publicId: bannerFromDb?.[0]?.publicId || '',
                    status: StatusImage.DELETED
                  }
                ]
              : [])
          ]
        : bannerFromDb?.[0]?.publicId && !banner_1_form?.publicId
          ? [
              {
                publicId: bannerFromDb?.[0]?.publicId || '',
                status: StatusImage.DELETED
              }
            ]
          : []),
      ...(banner_2_ToSave
        ? [
            {
              ...(formData?.banner2 ?? {}),
              ...banner_2_ToSave,
              id: undefined,

              type: ImageType.BANNER,
              altText: `Banner 2 của nhà hàng`,
              status: StatusImage.NEW
            },
            ...(bannerFromDb && bannerFromDb?.length > 1
              ? [
                  {
                    publicId: bannerFromDb?.[1]?.publicId || '',
                    status: StatusImage.DELETED
                  }
                ]
              : [])
          ]
        : bannerFromDb?.[1]?.publicId && !banner_2_form?.publicId
          ? [
              {
                publicId: bannerFromDb?.[1]?.publicId || '',
                status: StatusImage.DELETED
              }
            ]
          : []),

      ...(gallery_ToSave && gallery_ToSave?.length > 0
        ? gallery_ToSave?.map((item: any, index) => ({
            ...(item
              ? {
                  ...item,
                  id: undefined,
                  type: ImageType.GALLERY,
                  altText: `Ảnh bổ sung ${index} của nhà hàng`,
                  status: StatusImage.NEW
                }
              : {})
          }))
        : []),
      ...(galleryDeleted && galleryDeleted?.length > 0
        ? galleryDeleted.map(publicId => ({
            publicId,
            status: StatusImage.DELETED
          }))
        : [])
    ];

    await mutationUpsert.mutateAsync({
      ...formData,
      images: imageReq
    });
  };

  return (
    <FormProvider {...formFields}>
      <form onSubmit={formFields.handleSubmit(onSubmit)}>
        <Group justify='flex-end' mb='md'>
          <BButton
            leftSection={<IconPlus size={16} />}
            onClick={() => {
              formFields.reset(bannerdefaultValues);
              setActiveBanner(null);
            }}
          >
            Tạo mới
          </BButton>
          <Paper
            withBorder
            radius='md'
            p='md'
            miw={154}
            onClick={() => !activeBanner && NotifyWarning('Hãy chọn 1 mẫu banner làm mặc định.')}
          >
            <Controller
              name='isActive'
              control={formFields.control}
              render={({ field, formState: { errors } }) => (
                <Switch
                  label={
                    <Group>
                      <Badge color={field.value ? '#195EFE' : 'red'}>{field.value ? 'Hiển thị' : 'Ẩn'}</Badge>
                    </Group>
                  }
                  disabled={!activeBanner}
                  className='text-mainColor duration-100'
                  checked={field.value}
                  onChange={e => field.onChange(e.currentTarget.checked)}
                  error={errors.isActive?.message}
                />
              )}
            />
          </Paper>
          <BButton
            loading={formFields.formState.isSubmitting}
            type='submit'
            disabled={!formFields.formState.isDirty && !activeBanner}
          >
            Lưu thay đổi
          </BButton>
        </Group>
        <ListBannerTemplate
          onSetDefaultBanner={banner => setActiveBanner(banner)}
          onDeletedBanner={() => {
            formFields.reset(bannerdefaultValues);
            setActiveBanner(null);
          }}
        />
        <Stack mb={'xl'}>
          <Flex gap='md' direction={{ base: 'column', lg: 'row' }}>
            <CarouselGallery onDeleted={galleryPublicIds => setGalleryDeleted(galleryPublicIds)} />
            <BannerInputSection />
          </Flex>
        </Stack>
      </form>
    </FormProvider>
  );
}
