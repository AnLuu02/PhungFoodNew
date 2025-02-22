import { Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconX } from '@tabler/icons-react';

const showNotification = ({
  id,
  title,
  message,
  color,
  icon
}: {
  id: string;
  title: string;
  message: string;
  color: 'green' | 'red' | 'blue' | 'yellow' | 'gray' | 'indigo';
  icon?: React.ReactNode;
}) => {
  notifications.show({
    id,
    position: 'top-right',
    withCloseButton: true,
    autoClose: 2000,
    title: (
      <Text size='sm' fw={700} c={'black'} w={'max-content'}>
        {title}
      </Text>
    ),
    message: (
      <Text size='sm' c={'black'} w={'max-content'}>
        {message}
      </Text>
    ),
    color,
    icon: icon,

    loading: false
  });
};

export const NotifySuccess = (title = 'Success', message = 'Operation successful!') => {
  showNotification({
    id: 'toast-success',
    title: title,
    message,
    color: 'indigo'
  });
};

export const NotifyError = (title = 'Error', message = 'An error occurred!') => {
  showNotification({
    id: 'toast-error',
    title: title,
    message,
    color: 'red',
    icon: <IconX size={20} />
  });
};
