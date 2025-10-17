'use client';

import { ReactNode, useCallback, useMemo, useState } from 'react';
import { createContext, useContextSelector } from 'use-context-selector';
import { ModalContextType, ModalType } from '~/types/modal';

type ModalContextValue = ModalContextType & {
  openModal: (type: ModalType, content?: ReactNode, data?: any) => void;
  closeModal: () => void;
};

const ModalContext = createContext<ModalContextValue | null>(null);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [modalState, setModalState] = useState<ModalContextType>({
    opened: false,
    modalType: null,
    modalContent: null,
    modalData: null
  });

  const openModal = useCallback((type: ModalType, content: ReactNode = null, data: any = null) => {
    setModalState({ opened: true, modalType: type, modalContent: content, modalData: data });
  }, []);

  const closeModal = useCallback(() => {
    setModalState({ opened: false, modalType: null, modalContent: null, modalData: null });
  }, []);

  const value = useMemo(
    () => ({
      ...modalState,
      openModal,
      closeModal
    }),
    [modalState, openModal, closeModal]
  );

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
};

// --- Hooks chọn lọc ---
export const useModalSelector = <T,>(selector: (v: ModalContextValue) => T): T => {
  return useContextSelector(ModalContext as any, selector);
};

// --- Helpers tiện dùng ---
export const useModalActions = () => {
  const openModal = useModalSelector(v => v.openModal);
  const closeModal = useModalSelector(v => v.closeModal);
  return { openModal, closeModal };
};

export const useModalState = () => {
  const opened = useModalSelector(v => v.opened);
  const modalType = useModalSelector(v => v.modalType);
  const modalContent = useModalSelector(v => v.modalContent);
  const modalData = useModalSelector(v => v.modalData);
  return { opened, modalType, modalContent, modalData };
};
