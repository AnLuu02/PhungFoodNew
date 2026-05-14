import { Stack, Text, Title } from '@mantine/core';
import { modals } from '@mantine/modals';
import { NotifyError, NotifySuccess } from '../FuncHandler/toast';

type HandleOptions = {
  type: 'delete' | 'confirm' | 'edit';
  customProps?: {
    children?: React.ReactNode;
    title?: string | React.ReactNode;
    note?: string | React.ReactNode;
    confirmLabel?: string;
    cancelLabel?: string;
    color?: string;
    onCancel?: () => Promise<void> | void;
    onConfirm?: () => Promise<void> | void;
  };
};

const modalConfigs: Record<'delete' | 'confirm' | 'edit', Record<any, string>> = {
  delete: {
    title: 'Xác nhận xóa dữ liệu?',
    children:
      'Bạn đang yêu cầu xóa mục này khỏi hệ thống. Hãy chắc chắn rằng bạn không còn nhu cầu sử dụng thông tin này nữa.',
    note: 'Hành động này không thể hoàn tác. Dữ liệu sẽ bị xóa vĩnh viễn.',
    confirmLabel: 'Xóa ngay',
    cancelLabel: 'Hủy bỏ',
    color: 'red'
  },
  edit: {
    title: 'Xác nhận thay đổi?',
    children: 'Các thay đổi bạn vừa thực hiện sẽ được cập nhật. Vui lòng kiểm tra kỹ lại các thông tin.',
    note: 'Dữ liệu cũ sẽ bị ghi đè bởi thông tin mới.',
    confirmLabel: 'Cập nhật',
    cancelLabel: 'Quay lại'
  },
  confirm: {
    title: 'Xác nhận hành động?',
    children: 'Dành một nhịp để kiểm tra lại các chi tiết để đảm bảo mọi thứ đều đúng như mong đợi.',
    note: 'Vui lòng rà soát kỹ để tránh những sai sót không đáng có.',
    confirmLabel: 'Xác nhận',
    cancelLabel: 'Hủy'
  }
};

export const onHandleModalAction = ({ type = 'confirm', customProps = {} }: HandleOptions) => {
  const cfg = modalConfigs[type] || modalConfigs.confirm;
  const finalTitle = customProps.title || cfg.title;
  const finalChildren = customProps.children || cfg.children;
  const finalNote = customProps.note || cfg.note;

  modals.openConfirmModal({
    title:
      typeof finalTitle === 'string' ? (
        <Title order={4} fw={700} className='font-quicksand'>
          {finalTitle}
        </Title>
      ) : (
        finalTitle
      ),

    children:
      typeof finalChildren === 'string' ? (
        <Stack gap={4}>
          <Text size='sm'>{finalChildren}</Text>
          {finalNote && (
            <Text size='xs' c='dimmed' className='italic'>
              Lưu ý: {finalNote}
            </Text>
          )}
        </Stack>
      ) : (
        finalChildren
      ),

    labels: {
      confirm: customProps.confirmLabel || cfg.confirmLabel,
      cancel: customProps.cancelLabel || cfg.cancelLabel
    },
    confirmProps: { bg: customProps.color || cfg.color },
    onCancel: () => customProps.onCancel?.(),
    onConfirm: async () => {
      try {
        await customProps.onConfirm?.();
        NotifySuccess('Chúc mừng bạn đã thao tác thành công!');
      } catch (e) {
        NotifyError('Đã xảy ra ngoại lệ. Hãy kiểm tra lại: ' + e);
      }
    }
  });
};
