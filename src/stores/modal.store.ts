import { create } from 'zustand';
import { ModalType } from '~/types/modal';

type ModalStore = {
  type: ModalType | null;
  opened: boolean;
  data: any;
  open: (type: ModalType, data?: any) => void;
  close: () => void;
};

export const useModalStore = create<ModalStore>(set => ({
  type: null,
  opened: false,
  data: null,

  open: (type, data = null) => set({ opened: true, type, data }),

  close: () => set({ opened: false, type: null, data: null })
}));
