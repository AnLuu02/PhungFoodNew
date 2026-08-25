import { Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconAlertCircle, IconX } from '@tabler/icons-react';
import { NotificationPosition } from 'node_modules/@mantine/notifications/lib/notifications.store';

const showNotification = ({
  id,
  title,
  message,
  color,
  icon,
  pos
}: {
  id: string;
  title: string;
  message: string;
  color: 'green' | 'red' | 'blue' | 'yellow' | 'gray' | 'indigo';
  icon?: React.ReactNode;
  pos?: NotificationPosition;
}) => {
  notifications.show({
    id,
    position: pos ?? 'top-right',
    withCloseButton: true,
    autoClose: 2000,
    title: (
      <Text size='sm' fw={700} w={'max-content'}>
        {title}
      </Text>
    ),
    message: (
      <Text size='sm' w={'max-content'}>
        {message}
      </Text>
    ),
    color,
    icon: icon,
    style: { zIndex: 9999 },
    loading: false
  });
};

export const NotifySuccess = (
  title = 'Thao tác thành công!',
  message = 'Thao tác thành công./',
  pos?: NotificationPosition
) => {
  showNotification({
    id: 'toast-success',
    title: title,
    message,
    color: 'indigo',
    pos
  });
};

export const NotifyError = (
  title = 'Thất bại!',
  message = 'Thao tác thất bại. Hãy thử lại./',
  pos?: NotificationPosition
) => {
  showNotification({
    id: 'toast-error',
    title: title,
    message,
    color: 'red',
    icon: <IconX size={20} />,
    pos
  });
};
export const NotifyWarning = (
  title = 'Cảnh báo!',
  message = ' Thao tác thất bại. Hãy thử lại./',
  pos?: NotificationPosition
) => {
  showNotification({
    id: 'toast-warning',
    title: title,
    message,
    color: 'yellow',
    icon: <IconAlertCircle size={20} />,
    pos
  });
};
