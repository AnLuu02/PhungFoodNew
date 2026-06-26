'use client';

import dynamic from 'next/dynamic';
import React from 'react';
import { useModalStore } from '~/stores/modal.store';

const ModalProductComments = dynamic(() => import('~/components/Modals/ModalProductComments'), { ssr: false });

const ModalProductDetails = dynamic(() => import('~/components/Modals/ModalProductDetails'), { ssr: false });

const ModalOrderDetails = dynamic(() => import('~/components/Modals/ModalOrderDetails'), { ssr: false });

const ModalSuccessAddToCart = dynamic(() => import('~/components/Modals/ModalSuccessAddCart'), { ssr: false });

const ModalDetailVoucher = dynamic(() => import('~/components/Modals/ModalVoucherDetail'), { ssr: false });

const ModalImageLibrary = dynamic(() => import('~/components/Modals/ModalImageLibrary'), { ssr: false });

export const GlobalModalProvider: React.FC = () => {
  const { opened, type, data, close } = useModalStore();

  return (
    <>
      <ModalProductComments type={type} opened={opened && type === 'comments'} onClose={close} data={data} />
      <ModalDetailVoucher type={type} opened={opened && type === 'voucher'} onClose={close} data={data} />
      <ModalProductDetails type={type} opened={opened && type === 'details'} onClose={close} data={data} />
      <ModalOrderDetails type={type} opened={opened && type === 'orders'} onClose={close} data={data} />
      <ModalSuccessAddToCart type={type} opened={opened && type === 'success'} onClose={close} data={data} />
      <ModalImageLibrary type={type} opened={opened && type === 'images_library'} onClose={close} data={data} />
    </>
  );
};
