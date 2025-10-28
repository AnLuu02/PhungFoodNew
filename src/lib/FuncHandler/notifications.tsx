import {
  IconAlertTriangle,
  IconBrandZapier,
  IconCircleCheck,
  IconClock,
  IconEye,
  IconInfoOctagon,
  IconX
} from '@tabler/icons-react';
export const getStatusIcon = (status: string) => {
  switch (status) {
    case 'sent':
      return <IconCircleCheck className='h-4 w-4 text-green-500' />;
    case 'delivered':
      return <IconCircleCheck className='h-4 w-4 text-blue-500' />;
    case 'read':
      return <IconEye className='h-4 w-4 text-purple-500' />;
    case 'scheduled':
      return <IconClock className='h-4 w-4 text-orange-500' />;
    case 'failed':
      return <IconX className='h-4 w-4 text-red-500' />;
    default:
      return <IconClock className='h-4 w-4 text-gray-500 dark:text-dark-text' />;
  }
};

export const getTypeIcon = (type: string) => {
  switch (type) {
    case 'success':
      return <IconCircleCheck className='h-4 w-4 text-green-500' />;
    case 'warning':
      return <IconAlertTriangle className='h-4 w-4 text-orange-500' />;
    case 'error':
      return <IconX className='h-4 w-4 text-red-500' />;
    case 'promotion':
      return <IconBrandZapier className='h-4 w-4 text-purple-500' />;
    default:
      return <IconInfoOctagon className='h-4 w-4 text-blue-500' />;
  }
};

export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'urgent':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'high':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'medium':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200 dark:text-dark-text';
  }
};
