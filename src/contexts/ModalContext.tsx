'use client';

import { createContext, ReactNode, useContext, useState } from 'react';
import { ModalContextType, ModalType } from '~/types/modal';

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [opened, setOpened] = useState(false);
  const [modalType, setModalType] = useState<ModalType>(null);
  const [modalContent, setModalContent] = useState<ReactNode | null>(null);
  const [modalData, setModalData] = useState<any>(null);

  const openModal = (type: ModalType, content: ReactNode = null, data: any = null) => {
    setModalType(type);
    setModalContent(content);
    setModalData(data);
    setOpened(true);
  };

  const closeModal = () => {
    setOpened(false);
    setModalType(null);
    setModalContent(null);
    setModalData(null);
  };

  return (
    <ModalContext.Provider value={{ opened, modalType, modalContent, modalData, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = (): ModalContextType => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};
