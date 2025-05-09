import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { ROLE } from '../constants';
import { UserService } from 'src/api/user/user.service';
import { plainToInstance } from 'class-transformer';
import { UserResponeDto } from 'src/api/auth/dto';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<ROLE[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const { user } = context.switchToHttp().getRequest();

    const currentUser = plainToInstance(
      UserResponeDto,
      await this.userService.findUserById(user.sub),
    );

    if (
      !currentUser ||
      !requiredRoles.some((role) => currentUser.role?.includes(role))
    )
      throw new ForbiddenException('CANNOT_ACCESS_RESOURCE');

    return true;
  }
}
