export const BEARER = 'Bearer';

export const jwtConstants = {
  type: {
    register: 'register_token',
  },
  expires: {
    register: '1h',
  },
  secret: '8Zz5tw0Ionm3XPZZfN0NOml3z9FMfmpgXwovR9fp6ryDIoGRM8EPHAB6iHsc0fb',
};

export enum ROLE {
  USER = 'user',
  PROMOTER = 'promoter',
  ADMIN = 'admin',
}

export enum ORDER_STATUS {
  PENDING = 'pending',
  CANCELLED = 'cancelled',
  PAID = 'paid',
}

export enum COUPON_TYPE {
  PERCENTAGE = 'percentage',
  NUMERIC = 'numeric',
}

export enum PROVIDER {
  GOOGLE = 'google',
  FACEBOOK = 'facebook',
  LOCAL = 'local',
}

export enum SEX {
  MALE = 'male',
  FEMALE = 'female',
}

export enum REGISTER_ORGANIZATION_STATUS {
  WAITING = 'waiting',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export enum SEAT_STATUS {
  AVAILABLE = 'available',
  BOOKED = 'booked',
  SELECTING = 'selecting',
}

export enum PAYMENT_METHOD {
  MOMO = 'Momo',
  PAYPAL = 'Paypal',
}

export enum EVENT_STATUS {
  ACTIVE = 'active',
  IN_REVIEW = 'in_review',
  APPROVED = 'approved',
  INACTIVE = 'inactive',
}

export enum EVENT_PRIVACY {
  PRIVATE = 'private',
  PUBLIC = 'public',
}

export enum EVENT_TYPE {
  ONLINE = 'online',
  OFFLINE = 'offline',
}

export enum BUSINESS_TYPE {
  COMPANY = 'company',
  INDIVIDUAL = 'individual',
}
