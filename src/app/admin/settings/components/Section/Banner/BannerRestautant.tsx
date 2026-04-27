'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Badge, Button, Card, Flex, Group, Paper, Stack, Switch } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { EntityType, ImageType } from '@prisma/client';
import { IconCalendarClock, IconPlus } from '@tabler/icons-react';
import { useCallback, useEffect, useState } from 'react';
import { Controller, FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { handleUploadFromClient, uploadMultipleToCloudinaryFromClient } from '~/lib/Cloudinary/client';
import { NotifyError, NotifySuccess, NotifyWarning } from '~/lib/FuncHandler/toast';
import { ImageInfoFromDb, StatusImage } from '~/shared/schema/image.info.schema';
import { ImageFromDb } from '~/shared/schema/image.schema';
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
    image: {
      url: undefined,
      urlFile: undefined,
      publicId: ''
    }
  },
  banner2: {
    image: {
      url: undefined,
      urlFile: undefined,
      publicId: ''
    }
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
        activeBanner && Array.isArray(activeBanner?.imageForEntities)
          ? activeBanner?.imageForEntities?.reduce(
              (
                acc: {
                  bannerFromDb: ImageInfoFromDb[];
                  galleryFromDb: ImageInfoFromDb[];
                },
                item: ImageInfoFromDb
              ) => {
                item?.type === ImageType.THUMBNAIL && acc.bannerFromDb?.push(item);
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
    const banner_1_form = formFields.getValues('banner1.image');
    const banner_2_form = formFields.getValues('banner2.image');
    const gallery_input = formFields.getValues('galleryInput');
    const [banner_1_ToSave, banner_2_ToSave, gallery_ToSave] = await Promise.all([
      banner_1_form?.urlFile
        ? handleUploadFromClient(banner_1_form?.urlFile, utils, {
            folder: EntityType.RESTAURANT + '/' + ImageType.THUMBNAIL
          })
        : undefined,
      banner_2_form?.urlFile
        ? handleUploadFromClient(banner_2_form?.urlFile, utils, {
            folder: EntityType.RESTAURANT + '/' + ImageType.THUMBNAIL
          })
        : undefined,
      gallery_input && gallery_input?.length > 0
        ? uploadMultipleToCloudinaryFromClient(gallery_input, utils, {
            folder: EntityType.RESTAURANT + '/' + ImageType.GALLERY
          })
        : undefined
    ]);
    const { bannerFromDb, galleryFromDb } =
      activeBanner && Array.isArray(activeBanner?.imageForEntities)
        ? activeBanner?.imageForEntities?.reduce(
            (
              acc: {
                bannerFromDb: ImageInfoFromDb[];
                galleryFromDb: ImageInfoFromDb[];
              },
              item: ImageInfoFromDb
            ) => {
              item?.type === ImageType.THUMBNAIL && acc.bannerFromDb?.push(item);
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
              id: undefined,
              type: ImageType.THUMBNAIL,
              altText: `Banner 1 của nhà hàng`,
              status: StatusImage.NEW,
              image: {
                ...banner_1_ToSave,
                type: ImageType.THUMBNAIL,
                altText: `Banner 1 của nhà hàng`
              }
            },
            ...(bannerFromDb && bannerFromDb?.length > 0
              ? [
                  {
                    id: bannerFromDb?.[0]?.id || '',
                    status: StatusImage.DELETED
                  }
                ]
              : [])
          ]
        : bannerFromDb?.[0]?.image?.publicId && !banner_1_form?.publicId
          ? [
              {
                id: bannerFromDb?.[0]?.id || '',
                status: StatusImage.DELETED
              }
            ]
          : []),
      ...(banner_2_ToSave
        ? [
            {
              ...(formData?.banner2 ?? {}),

              id: undefined,
              type: ImageType.THUMBNAIL,
              altText: `Banner 2 của nhà hàng`,
              status: StatusImage.NEW,
              image: {
                ...banner_2_ToSave,
                type: ImageType.THUMBNAIL,
                altText: `Banner 2 của nhà hàng`
              }
            },
            ...(bannerFromDb && bannerFromDb?.length > 1
              ? [
                  {
                    id: bannerFromDb?.[1]?.id || '',
                    status: StatusImage.DELETED
                  }
                ]
              : [])
          ]
        : bannerFromDb?.[1]?.image?.publicId && !banner_2_form?.publicId
          ? [
              {
                id: bannerFromDb?.[1]?.id || '',
                status: StatusImage.DELETED
              }
            ]
          : []),

      ...(gallery_ToSave && gallery_ToSave?.length > 0
        ? gallery_ToSave?.map((item: any, index) => ({
            ...(item
              ? {
                  id: undefined,
                  type: ImageType.GALLERY,
                  altText: `Ảnh bổ sung ${index} của nhà hàng`,
                  status: StatusImage.NEW,
                  entityType: EntityType.BANNER,
                  image: {
                    ...item,
                    id: undefined,
                    altText: `Ảnh bổ sung ${index} của nhà hàng`,
                    type: ImageType.GALLERY
                  }
                }
              : {})
          }))
        : []),
      ...(galleryDeleted && galleryDeleted?.length > 0
        ? galleryDeleted.map(imageForEntityId => ({
            id: imageForEntityId,
            status: StatusImage.DELETED
          }))
        : [])
    ];

    await mutationUpsert.mutateAsync({
      ...formData,
      restaurantId,
      imageForEntities: imageReq
    });
  };

  const handleSetDefaultBanner = useCallback((banner: any) => {
    setActiveBanner(banner);
  }, []);
  const handleDeleteBanner = useCallback(() => {
    formFields.reset(bannerdefaultValues);
    setActiveBanner(null);
  }, []);

  return (
    <FormProvider {...formFields}>
      <form onSubmit={formFields.handleSubmit(onSubmit)}>
        <Group justify='flex-end' mb='md'>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() => {
              formFields.reset(bannerdefaultValues);
              setActiveBanner(null);
            }}
          >
            Tạo mới
          </Button>
          <Paper
            withBorder
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
          <Button
            loading={formFields.formState.isSubmitting}
            type='submit'
            disabled={!formFields.formState.isDirty && !activeBanner}
          >
            Lưu thay đổi
          </Button>
        </Group>
        <ListBannerTemplate onSetDefaultBanner={handleSetDefaultBanner} onDeletedBanner={handleDeleteBanner} />
        <Card radius={'lg'} padding={'sm'} className='bg-backgroundAdmin'>
          <Stack mb={'xl'}>
            <Group align='flex-end' gap='xs'>
              <Controller
                name='startDate'
                control={formFields.control}
                render={({ field }) => (
                  <DatePickerInput
                    leftSection={<IconCalendarClock size={18} />}
                    label='Có hiệu lực từ'
                    placeholder='Từ ngày'
                    {...field}
                    style={{ flex: 1 }}
                  />
                )}
              />
              <Controller
                name='endDate'
                control={formFields.control}
                render={({ field }) => (
                  <DatePickerInput
                    leftSection={<IconCalendarClock size={18} />}
                    label='Đến ngày'
                    placeholder='Đến ngày'
                    {...field}
                    style={{ flex: 1 }}
                  />
                )}
              />
            </Group>
            <Flex gap='md' direction={{ base: 'column', lg: 'row' }}>
              <CarouselGallery onDeleted={galleryPublicIds => setGalleryDeleted(galleryPublicIds)} />
              <BannerInputSection />
            </Flex>
          </Stack>
        </Card>
      </form>
    </FormProvider>
  );
}
