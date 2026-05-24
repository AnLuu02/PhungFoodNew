import { TypeContact } from '@prisma/client';

export const ContactTypeOptions = {
  [TypeContact.COLLABORATION]: { viName: 'Hợp tác', color: 'violet' },
  [TypeContact.FEEDBACK]: { viName: 'Phản hồi', color: 'yellow' },
  [TypeContact.SUPPORT]: { viName: 'Hỗ trợ', color: 'blue' },
  [TypeContact.OTHER]: { viName: 'Khác', color: 'gray' }
};
