'use client';

import React, { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import { ModalActions, ModalState, ModalType } from '~/types/modal';

const ModalStateContext = createContext<ModalState | null>(null);
const ModalActionsContext = createContext<ModalActions | null>(null);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [modalState, setModalState] = useState<ModalState>({
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

  const actionsValue = useMemo(() => ({ openModal, closeModal }), [openModal, closeModal]);

  const stateValue = modalState;

  return (
    <ModalActionsContext.Provider value={actionsValue}>
      <ModalStateContext.Provider value={stateValue}>{children}</ModalStateContext.Provider>
    </ModalActionsContext.Provider>
  );
};

export const useModalActions = (): ModalActions => {
  const context = useContext(ModalActionsContext);
  if (context === null) {
    throw new Error('useModalActions must be used within a ModalProvider');
  }
  return context;
};
export const useModalState = (): ModalState => {
  const context = useContext(ModalStateContext);
  if (context === null) {
    throw new Error('useModalState must be used within a ModalProvider');
  }
  return context;
};
