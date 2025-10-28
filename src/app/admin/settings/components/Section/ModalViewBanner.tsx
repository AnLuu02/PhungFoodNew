'use client';

import { Modal, Text } from '@mantine/core';
import { useEffect, useMemo, useState } from 'react';
import { vercelBlobToFile } from '~/lib/FuncHandler/handle-file-base64';
import { LocalImageType } from '~/lib/ZodSchema/enum';
import { CarouselBanner } from '../CarouselBanner';

export default function ModalViewBanner({ viewBanner, setViewBanner }: any) {
  const [gallery, setGallery] = useState<any[]>([]);
  const [banner1, setBanner1] = useState<File | null>(null);
  const [banner2, setBanner2] = useState<File | null>(null);
  const previewUrls = useMemo(
    () => gallery?.map(image => (image instanceof File ? URL.createObjectURL(image) : image)) || [],
    [gallery]
  );
  useEffect(() => {
    if (viewBanner?.id) {
      const banners: string[] = [];
      const gallery: string[] = [];

      viewBanner.images.forEach((image: any) => {
        if (image.type === LocalImageType.BANNER) banners.push(image.url);
        else if (image.type === LocalImageType.GALLERY) gallery.push(image.url);
      });

      Promise.all([
        banners[0] ? vercelBlobToFile(banners[0]) : null,
        banners[1] ? vercelBlobToFile(banners[1]) : null,
        gallery.length > 0 ? vercelBlobToFile(gallery, { type: 'multiple' }) : []
      ]).then(([banner1, banner2, images]) => {
        if (banner1 instanceof File) setBanner1(banner1);
        if (banner2 instanceof File) setBanner2(banner2);
        const galleryImages =
          Array.isArray(images) && images.every(img => img instanceof File)
            ? images.map((img, index) => ({ key: `gallery_${index}`, file: img })).filter(Boolean)
            : [];

        setGallery(galleryImages.map(img => img.file));
      });
    }
  }, [viewBanner]);
  return (
    <>
      <Modal
        size={'70%'}
        opened={viewBanner ? true : false}
        onClose={() => setViewBanner(null)}
        title={<Text fw={700}>Quản lý banner</Text>}
        centered
      >
        {viewBanner ? (
          <CarouselBanner banner1={banner1} banner2={banner2} galleries={gallery} previewUrls={previewUrls} />
        ) : null}
      </Modal>
    </>
  );
}
