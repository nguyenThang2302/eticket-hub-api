import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import { COUPON_TYPE } from '../common/constants';
import { apiSkipLogs, isFieldMask } from 'src/config/helpers.config';

export function IsValidPassword(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isValidPassword',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: 'FIELD-0004',
        ...validationOptions,
      },
      validator: {
        validate(value: any, args: ValidationArguments) {
          const hasNumber = /\d/.test(value);
          const hasLowercase = /[a-z]/.test(value);
          const hasUppercase = /[A-Z]/.test(value);
          return (
            typeof value === 'string' &&
            value.length >= 8 &&
            value.length < 255 &&
            hasNumber &&
            hasLowercase &&
            hasUppercase
          );
        },
      },
    });
  };
}

export function calculateDiscount(
  price: number,
  coupons: { type: string; amount: number },
) {
  if (coupons.type === COUPON_TYPE.PERCENTAGE) {
    return +((price * coupons.amount) / 100).toFixed(2);
  }

  if (coupons.type === COUPON_TYPE.NUMERIC) {
    return +coupons.amount.toFixed(2);
  }
}

export function calculateTax(price: number, tax: number) {
  return +(price * tax).toFixed(2);
}

export function fullMaskingData(obj: Record<string, any>) {
  const maskedObj: Record<string, any> = {};

  if (obj === undefined) {
    return maskedObj;
  }

  Object.keys(obj).forEach((key) => {
    if (isFieldMask.includes(key)) {
      maskedObj[key] = '***';
    } else {
      maskedObj[key] = obj[key];
    }
  });

  return maskedObj;
}

export function isApiSkipped(endpoint: string, method: string): boolean {
  for (const skipApi of apiSkipLogs) {
    if (endpoint.startsWith(skipApi.api) && skipApi.method.includes(method)) {
      return true;
    }
  }
  return false;
}
