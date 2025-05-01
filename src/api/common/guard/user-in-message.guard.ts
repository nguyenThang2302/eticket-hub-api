import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { OrganizeService } from 'src/api/organize/organize.service';

@Injectable()
export class UserInMessage implements CanActivate {
  constructor(private readonly organizeService: OrganizeService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user['sub'];
    const receiverId = request.params.receiver_id;
    const senderId = request.params.sender_id;

    const isUserInMessage = userId === receiverId || userId === senderId;

    if (!isUserInMessage) {
      throw new UnauthorizedException('AUTH-0504');
    }

    return true;
  }
}
