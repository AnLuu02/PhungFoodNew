import {
  IconAlertTriangle,
  IconBrandZapier,
  IconCircleCheck,
  IconCircleX,
  IconClock,
  IconEye,
  IconInfoCircle
} from '@tabler/icons-react';
import { NotificationType } from '~/lib/ZodSchema/enum';
import { NotificationClientHasUser } from '~/types';

export const getTypeIcon = (type: string) => {
  switch (type) {
    case 'success':
      return <IconCircleCheck className='h-6 w-6 text-green-500' />;
    case 'warning':
      return <IconAlertTriangle className='h-6 w-6 text-orange-500' />;
    case 'error':
      return <IconCircleX className='h-6 w-6 text-red-500' />;
    case 'promotion':
      return <IconBrandZapier className='h-6 w-6 text-purple-500' />;
    default:
      return <IconInfoCircle className='h-6 w-6 text-blue-500' />;
  }
};

export const notificationPriorityInfo = {
  low: { viName: 'Thấp', color: 'bg-gray-100 text-gray-800 border-gray-200' },
  medium: { viName: 'Trung bình', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  high: { viName: 'Cao', color: 'bg-orange-100 text-orange-800 border-orange-200' },
  urgent: { viName: 'Khẩn cấp', color: 'bg-red-100 text-red-800 border-red-200' }
};

export const notificationStatusInfo = {
  draft: { viName: 'Bản nháp', icon: <IconClock className='h-4 w-4 text-gray-500' /> },
  scheduled: { viName: 'Đã lên lịch', icon: <IconClock className='h-4 w-4 text-orange-500' /> },
  sent: { viName: 'Đã gửi', icon: <IconCircleCheck className='h-4 w-4 text-green-500' /> },
  delivered: { viName: 'Đã gửi thành công', icon: <IconCircleCheck className='h-4 w-4 text-blue-500' /> },
  read: { viName: 'Đã đọc', icon: <IconEye className='h-4 w-4 text-purple-500' /> },
  failed: { viName: 'Gửi thất bại', icon: <IconCircleX className='h-4 w-4 text-red-500' /> }
};

export const notificationTypeOptions = {
  [NotificationType.SYSTEM]: { viName: 'Hệ thống' },
  [NotificationType.USER_ACTIVITY]: { viName: 'Hoạt động người dùng' },
  [NotificationType.ORDER]: { viName: 'Đơn hàng' },
  [NotificationType.PROMOTION]: { viName: 'Khuyến mãi' },
  [NotificationType.SECURITY]: { viName: 'Bảo mật' },
  [NotificationType.ADMIN]: { viName: 'Quản trị viên' },
  [NotificationType.SUPPORT]: { viName: 'Hỗ trợ' },
  [NotificationType.REMINDER]: { viName: 'Nhắc nhở' }
};

//
export const updateActionClient = async ({
  mutationUpdateAction,
  data,
  session,
  action
}: {
  mutationUpdateAction: any;
  data: NotificationClientHasUser;
  session: any;
  action: 'sent' | 'delivered' | 'read' | 'clicked';
}) => {
  await mutationUpdateAction.mutateAsync({
    where: { id: data.id },
    data: {
      analytics: {
        ...data.analytics,
        [action]: (data.analytics?.[action] || 0) + 1
      },
      recipients: {
        upsert: {
          where: {
            notificationId_userId: {
              notificationId: data.id,
              userId: session.user.id
            }
          },
          create: {
            user: { connect: { id: session.user.id } },
            [action + 'At']: new Date()
          },
          update: {
            [action + 'At']: new Date()
          }
        }
      }
    }
  });
};

export function extractVariables(template: string): string[] {
  const regex = /{{\s*(\w+)\s*}}/g;
  const vars: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = regex.exec(template))) vars.push(match[1] as string);
  return [...new Set(vars)];
}

export function renderTemplate(template: string, data: Record<string, any>) {
  return template.replace(/{{\s*([\w.]+)\s*}}/g, (_, path) => {
    const parts = path.split('.');
    let value = data;
    for (const key of parts) {
      if (value && key in value) {
        value = value[key];
      } else {
        return `{{${path}}}`;
      }
    }
    return String(value);
  });
}
