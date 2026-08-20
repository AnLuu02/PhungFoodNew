'use client';
import { Button, Tooltip } from '@mantine/core';
import { IconEye } from '@tabler/icons-react';
import Link from 'next/link';
import { ProductBase } from '~/shared/type-trpc/product.type-trpc';
import { useModalStore } from '~/stores/modal.store';
export const ButtonViewProduct = ({ data, isMobile }: { data: ProductBase; isMobile?: boolean }) => {
  const openModal = useModalStore(s => s.open);
  return (
    <Tooltip label='Xem nhanh' key={data?.tag}>
      {isMobile ? (
        <Button
          component={Link}
          href={`/san-pham/${data?.tag}`}
          size='xs'
          w={30}
          h={30}
          variant='default'
          className={`flex items-center justify-center rounded-full text-mainColor hover:text-subColor`}
        >
          <IconEye size={20} />
        </Button>
      ) : (
        <Button
          onClick={() => {
            openModal('details', data);
          }}
          size='xs'
          w={30}
          h={30}
          variant='default'
          className={`flex items-center justify-center rounded-full text-mainColor hover:text-subColor`}
        >
          <IconEye />
        </Button>
      )}
    </Tooltip>
  );
};
