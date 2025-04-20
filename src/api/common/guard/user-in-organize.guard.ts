import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { OrganizeService } from 'src/api/organize/organize.service';

@Injectable()
export class UserInOrganize implements CanActivate {
  constructor(private readonly organizeService: OrganizeService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user['sub'];
    const organizeId = request['auth']['organizeConfig']['organizeId'];

    const isUserInOrganize = await this.organizeService.checkUserInOrganize(
      userId,
      organizeId,
    );

    if (!isUserInOrganize) {
      throw new UnauthorizedException('AUTH-0504');
    }

    return true;
  }
}
