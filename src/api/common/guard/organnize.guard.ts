import * as _ from 'lodash';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { OrganizeService } from 'src/api/organize/organize.service';

@Injectable()
export class OrganizeGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly organizeService: OrganizeService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const organizeIdInHeader = _.get(
      request,
      'headers.x-api-organize-id',
      null,
    );
    if (_.isEmpty(organizeIdInHeader)) {
      throw new UnauthorizedException('AUTH-0504');
    }
    const organize =
      await this.organizeService.getOrganizationById(organizeIdInHeader);

    if (_.isEmpty(organize)) {
      throw new UnauthorizedException('AUTH-0504');
    }

    request['auth'] = {
      organizeConfig: {
        organizeId: _.get(organize, 'id'),
      },
    };

    return true;
  }
}
