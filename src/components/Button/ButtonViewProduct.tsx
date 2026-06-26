'use client';
import { Button, Tooltip } from '@mantine/core';
import { IconEye } from '@tabler/icons-react';
import Link from 'next/link';
import { useModalStore } from '~/stores/modal.store';
export const ButtonViewProduct = ({ data, isMobile }: { data: any; isMobile?: boolean }) => {
  const openModal = useModalStore(s => s.open);
  return (
    <Tooltip label='Xem nhanh'>
      {isMobile ? (
        <Button
          size='xs'
          w={30}
          h={30}
          variant='default'
          className={`border-t-r-0 flex items-center justify-center rounded-full text-mainColor sm:hover:text-subColor`}
        >
          <Link href={`/san-pham/${data?.tag}`}>
            <IconEye size={20} />
          </Link>
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
          className={`border-t-r-0 flex items-center justify-center rounded-full text-mainColor sm:hover:text-subColor`}
        >
          <IconEye />
        </Button>
      )}
    </Tooltip>
  );
};
