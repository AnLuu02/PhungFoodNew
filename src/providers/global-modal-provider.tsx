'use client';

import dynamic from 'next/dynamic';
import React from 'react';
import { useModalStore } from '~/stores/modal.store';

const ModalProductComments = dynamic(() => import('~/components/modals/modal-product-comments'), { ssr: false });

const ModalProductDetails = dynamic(() => import('~/components/modals/modal-product-details'), { ssr: false });

const ModalOrderDetails = dynamic(() => import('~/components/modals/modal-order-details'), { ssr: false });

const ModalVoucherDetail = dynamic(() => import('~/components/modals/modal-voucher-detail'), { ssr: false });

const ModalSuccessAddToCart = dynamic(() => import('~/components/modals/modal-success-add-cart'), { ssr: false });

const ModalImageLibrary = dynamic(() => import('~/components/modals/modal-image-library'), { ssr: false });

export const GlobalModalProvider: React.FC = () => {
  const { opened, type, data, close } = useModalStore();

  return (
    <>
      <ModalProductComments type={type} opened={opened && type === 'comments'} onClose={close} data={data} />
      <ModalVoucherDetail type={type} opened={opened && type === 'voucher'} onClose={close} data={data} />
      <ModalProductDetails type={type} opened={opened && type === 'details'} onClose={close} data={data} />
      <ModalOrderDetails type={type} opened={opened && type === 'orders'} onClose={close} data={data} />
      <ModalSuccessAddToCart type={type} opened={opened && type === 'success'} onClose={close} data={data} />
      <ModalImageLibrary type={type} opened={opened && type === 'images_library'} onClose={close} data={data} />
    </>
  );
};
