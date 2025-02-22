import { Text, Title } from '@mantine/core';
import { modals } from '@mantine/modals';
import { NotifyError, NotifySuccess } from '../func-handler/toast';

export const handleConfirm = (
  id?: String,
  mutation?: any,
  formData?: {},
  title?: String,
  content?: String,
  callback?: any
) => {
  modals.openConfirmModal({
    title: (
      <Title order={4} fw={700} className='font-quicksand'>
        {title}
      </Title>
    ),
    children: <Text size='sm'>{content}</Text>,
    labels: { confirm: title, cancel: 'Hủy' },
    confirmProps: { color: 'red' },
    onCancel: () => {},
    onConfirm: async () => {
      try {
        const result = id
          ? await mutation.mutateAsync({ id: id as string, ...formData })
          : await mutation.mutateAsync(formData);
        if (result.success) {
          callback();
          NotifySuccess('Thành công!', `${title}`);
        } else {
          NotifyError('Lỗi!', 'Đã có lỗi xảy ra.');
        }
      } catch (e) {
        NotifyError('Lỗi!', 'Đã có lỗi xảy ra.' + e);
      }
    }
  });
};
