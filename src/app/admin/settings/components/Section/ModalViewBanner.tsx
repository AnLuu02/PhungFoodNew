'use client';

import { Modal, Text } from '@mantine/core';
import { ImageType } from '@prisma/client';
import { useMemo } from 'react';
import { CarouselBanner } from '../CarouselBanner';

export default function ModalViewBanner({ viewBanner, setViewBanner }: any) {
  const { banners, gallery } = useMemo(() => {
    return (viewBanner?.images || []).reduce(
      (acc: { banners: string[]; gallery: string[] }, img: any) => {
        const url = img?.url || '';
        if (img.type === ImageType.BANNER) acc.banners.push(url);
        if (img.type === ImageType.GALLERY) acc.gallery.push(url);
        return acc;
      },
      { banners: [] as string[], gallery: [] as string[] }
    );
  }, [viewBanner?.images]);
  return (
    <>
      <Modal
        size={'70%'}
        radius={'md'}
        opened={viewBanner ? true : false}
        onClose={() => setViewBanner(null)}
        title={<Text fw={700}>Quản lý banner</Text>}
        centered
      >
        {viewBanner ? (
          <CarouselBanner banner1={banners?.[0]} banner2={banners?.[1]} galleries={gallery} previewUrls={gallery} />
        ) : null}
      </Modal>
    </>
  );
}
