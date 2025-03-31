export const isFieldMask = [
  'email',
  'password',
  'authorization',
  'postman-token',
  'access_token',
  'access_token_expire_time',
  'refresh_token',
  'refresh_token_expire_time',
  'token_type',
  'role',
  'name',
  'customer_name',
  'phone_number',
  'address',
  'city',
  'coupon_code',
  'payment_method_id',
  'items',
  'payment_method_name',
  'order_id',
  'payment_order_id',
  'pagination',
];

export const apiSkipLogs = [
  {
    api: '/api/v1/orders',
    method: ['GET'],
  },
  {
    api: '/api/v1/reviews',
    method: ['GET'],
  },
  {
    api: '/api/v1/cars',
    method: ['GET'],
  },
  {
    api: '/api/v1/car-tags',
    method: ['GET'],
  },
  {
    api: '/api/v1/orders/preview',
    method: ['POST'],
  },
];

export const statusCodeErrorSkipSentry = [400, 403, 401];
