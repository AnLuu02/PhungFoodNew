export enum LocalImageType {
  THUMBNAIL = 'THUMBNAIL',
  GALLERY = 'GALLERY',
  LOGO = 'LOGO',
  BANNER = 'BANNER'
}

export enum LocalEntityType {
  PRODUCT = 'PRODUCT',
  USER = 'USER',
  CATEGORY = 'CATEGORY',
  RESTAURANT = 'RESTAURANT'
}

export enum LocalVoucherType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED = 'FIXED'
}

export enum LocalPaymentType {
  CREDIT_CARD = 'CREDIT_CARD',
  E_WALLET = 'E_WALLET'
}

export enum LocalOrderStatus {
  COMPLETED = 'COMPLETED',
  PENDING = 'PENDING',
  UNPAID = 'UNPAID',
  CONFIRMED = 'CONFIRMED',
  SHIPPING = 'SHIPPING',
  CANCELLED = 'CANCELLED'
}

export enum LocalGender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER'
}

export enum LocalUserLevel {
  BRONZE = 'BRONZE',
  SILVER = 'SILVER',
  GOLD = 'GOLD',
  PLATINUM = 'PLATINUM',
  DIAMOND = 'DIAMOND'
}

export enum LocalAddressType {
  HOME = 'HOME',
  WORKPLACE = 'WORKPLACE',
  DELIVERY = 'DELIVERY'
}

export enum TypeContact {
  COLLABORATION = 'COLLABORATION',
  SUPPORT = 'SUPPORT',
  FEEDBACK = 'FEEDBACK',
  OTHER = 'OTHER'
}

export enum NotificationType {
  SYSTEM = 'SYSTEM',
  USER_ACTIVITY = 'USER_ACTIVITY',
  ORDER = 'ORDER',
  PROMOTION = 'PROMOTION',
  SECURITY = 'SECURITY',
  ADMIN = 'ADMIN',
  SUPPORT = 'SUPPORT',
  REMINDER = 'REMINDER'
}
