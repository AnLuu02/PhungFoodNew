import { Text, Title } from '@mantine/core';
import { modals } from '@mantine/modals';
import { NotifyError, NotifySuccess } from '../func-handler/toast';

type ConfirmDeleteOptions = {
  id: Record<string, any>;
  mutationDelete: { mutateAsync: (data: any) => Promise<any> };
  entityName?: string;
  callback?: () => Promise<void> | void;
  messages?: {
    confirmTitle?: string;
    confirmText?: string;
    success?: string;
    error?: string;
  };
};

export const confirmDelete = ({
  id,
  mutationDelete,
  entityName = 'mục này',
  callback,
  messages = {}
}: ConfirmDeleteOptions) => {
  const {
    confirmTitle = `Xóa ${entityName}`,
    confirmText = `Bạn có chắc chắn muốn xóa ${entityName} không? Hành động này sẽ không thể khôi phục.`,
    success = `Xóa ${entityName} thành công.`,
    error = 'Đã có lỗi xảy ra.'
  } = messages;

  modals.openConfirmModal({
    title: (
      <Title order={4} fw={700} className='font-quicksand'>
        {confirmTitle}
      </Title>
    ),
    children: <Text size='sm'>{confirmText}</Text>,
    labels: { confirm: `Xóa ${entityName}`, cancel: 'Không, đừng xóa nó' },
    confirmProps: { color: 'red' },
    onCancel: () => {},
    onConfirm: async () => {
      try {
        const result = await mutationDelete.mutateAsync({ ...id });
        if (result?.success || result?.id) {
          await callback?.();
          NotifySuccess('Thành công!', success);
        } else {
          NotifyError('Thất bại!', error);
        }
      } catch (e) {
        NotifyError('Đã xảy ra ngoại lệ. Hãy kiểm tra lại.');
      }
    }
  });
};
