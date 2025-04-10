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
  OPEN = 'open',
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
