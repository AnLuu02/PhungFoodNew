export type Notification = {
  id: string;

  userId: string[];

  title: string;

  message: string;

  isRead: boolean;

  isSendToAll: boolean;
};

export interface NotificationAdvanced {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'promotion';
  recipient: 'individual' | 'all' | 'group' | 'inBoxidual';
  recipientDetails?: string;
  status: 'draft' | 'scheduled' | 'sent' | 'delivered' | 'read' | 'failed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  channels: ('push' | 'email' | 'sms' | 'in-app')[];
  scheduledAt?: Date;
  sentAt?: Date;
  readAt?: Date;
  createdAt: Date;
  template?: string;
  tags: string[];
  analytics: {
    sent: number;
    delivered: number;
    read: number;
    clicked: number;
  };
}

export interface NotificationTemplate {
  id: string;
  name: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'promotion';
  category: string;
  variables: string[];
}

export interface NotificationPreference {
  userId: string;
  email: boolean;
  sms: boolean;
  push: boolean;
  inApp: boolean;
  categories: {
    orders: boolean;
    promotions: boolean;
    system: boolean;
    general: boolean;
  };
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

export interface AutoNotificationRule {
  id: string;
  name: string;
  trigger:
    | 'order_placed'
    | 'order_ready'
    | 'payment_received'
    | 'user_registered'
    | 'low_stock'
    | 'user_registration'
    | 'order_status_change';
  template: string;
  enabled: boolean;
  conditions: Record<string, any>;
  delay?: number;
}
