import * as _ from 'lodash';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Group } from 'src/database/entities/group.entity';
import { Repository } from 'typeorm';
import { Event } from 'src/database/entities/event.entity';

@Injectable()
export class UserEventOrganizeGuard implements CanActivate {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userID = _.get(request, 'user.sub', null);
    const { event_id: eventId } = request.params;
    const organizeId = _.get(request, 'auth.organizeConfig.organizeId', null);
    const userInOrganize = await this.groupRepository.findOne({
      where: {
        user_id: userID,
        organization_id: organizeId,
      },
    });
    const eventInOrganize = await this.eventRepository.findOne({
      where: {
        id: eventId,
        organization: {
          id: organizeId,
        },
      },
    });
    if (_.isEmpty(userInOrganize) || _.isEmpty(eventInOrganize)) {
      throw new ForbiddenException('CUS-0402');
    }
    return true;
  }
}
