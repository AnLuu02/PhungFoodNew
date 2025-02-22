import { Text, Title } from '@mantine/core';
import { modals } from '@mantine/modals';
import { NotifyError, NotifySuccess } from '../func-handler/toast';

export const handleDelete = (id: {}, mutationDelete: any, type?: String, callback?: any) => {
  modals.openConfirmModal({
    title: (
      <Title order={4} fw={700} className='font-quicksand'>
        Xóa {type || 'đơn hàng'}
      </Title>
    ),
    children: (
      <Text size='sm'>
        Bạn có chắc chắn muốn xóa {type || 'đơn hàng'} không? Hành động này sẽ không hỗ trợ khôi phục dữ liệu của bạn.
      </Text>
    ),
    labels: { confirm: `Xóa ${type || 'đơn hàng'}`, cancel: 'Không, đừng xóa nó' },
    confirmProps: { color: 'red' },
    onCancel: () => {},
    onConfirm: async () => {
      try {
        const result = await mutationDelete.mutateAsync({ ...id });
        if (result.success) {
          await callback();
          NotifySuccess('Thành công!', `Xóa ${type || 'Đơn hàng'} thành công.`);
        } else {
          NotifyError('Lỗi!', 'Đã có lỗi xảy ra.');
        }
      } catch (e) {
        NotifyError('Lỗi!', 'Đã có lỗi xảy ra. catch' + e);
      }
    }
  });
};
