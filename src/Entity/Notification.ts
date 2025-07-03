export type Notification = {
  id: string;

  userId: string[];

  title: string;

  message: string;

  isRead: boolean;

  isSendToAll: boolean;
};
