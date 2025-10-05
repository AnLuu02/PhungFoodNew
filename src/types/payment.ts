export type Payment = {
  id: string;
  provider: string;
  name: string;
  apiKey?: string;
  secretKey?: string;
  clientId?: string;
  clientSecret?: string;
  webhookUrl?: string;
  webhookSecret?: string;
  isSandbox?: boolean;
  isActive?: boolean;
  metadata?: any;
};
