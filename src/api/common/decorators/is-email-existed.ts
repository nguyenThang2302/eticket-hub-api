import { Injectable } from '@nestjs/common';
import {
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';
import { UserService } from 'src/api/user/user.service';

@ValidatorConstraint({ name: 'IsEmailExisted', async: true })
@Injectable()
export class IsEmailExistedConstraint implements ValidatorConstraintInterface {
  constructor(private userService: UserService) {}

  async validate(value: string) {
    try {
      const existedUser = await this.userService.findExistingEmail(value);

      if (existedUser) return false;
    } catch (e) {
      return false;
    }

    return true;
  }
}

export function IsEmailExisted(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsEmailExisted',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsEmailExistedConstraint,
    });
  };
}
