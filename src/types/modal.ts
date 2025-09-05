import { ReactNode } from 'react';

export type ModalType = 'comments' | 'details' | 'confirm' | 'orders' | 'success' | 'recipe' | 'voucher' | null;

export type ModalProps<T> = {
  type?: ModalType;
  opened: boolean;
  onClose: () => void;
  data: T;
};

export type ModalContextType = {
  opened: boolean;
  modalType: ModalType;
  modalContent: ReactNode | null;
  modalData: any;
  openModal: (type: ModalType, content?: ReactNode, data?: any) => void;
  closeModal: () => void;
};
