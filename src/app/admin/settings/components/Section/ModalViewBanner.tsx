'use client';

import { Flex, Modal, Text } from '@mantine/core';
import { ImageType } from '@prisma/client';
import { Dispatch, SetStateAction, useMemo } from 'react';
import { ImageInfoFromDb } from '~/shared/schema/image.info.schema';
import BannerInputSection from './Banner/BannerInput';
import { CarouselGallery } from './Banner/CarouselGallery';

export default function ModalViewBanner({
  viewBanner,
  setViewBanner
}: {
  viewBanner: { isOpened: boolean; activeBanner: any };
  setViewBanner: Dispatch<SetStateAction<{ isOpened: boolean; activeBanner: any }>>;
}) {
  const { banners, galleries } = useMemo(() => {
    return viewBanner?.activeBanner && Array.isArray(viewBanner?.activeBanner?.imageForEntities)
      ? viewBanner?.activeBanner?.imageForEntities?.reduce(
          (
            acc: {
              banners: ImageInfoFromDb[];
              galleries: ImageInfoFromDb[];
            },
            item: ImageInfoFromDb
          ) => {
            item?.type === ImageType.THUMBNAIL && acc.banners?.push(item);
            item?.type === ImageType.GALLERY && acc.galleries?.push(item);
            return acc;
          },
          { banners: [], galleries: [] }
        )
      : { banners: [], galleries: [] };
  }, [viewBanner?.activeBanner]);
  return (
    <>
      <Modal
        size={'70%'}
        opened={viewBanner.isOpened}
        onClose={() => setViewBanner({ isOpened: false, activeBanner: {} })}
        title={<Text fw={700}>Quản lý banner</Text>}
        centered
      >
        {viewBanner?.activeBanner?.id ? (
          <Flex gap='md' direction={{ base: 'column', lg: 'row' }}>
            <CarouselGallery mode='view' galleries={galleries} />
            <BannerInputSection mode='view' banners={banners} />
          </Flex>
        ) : null}
      </Modal>
    </>
  );
}
