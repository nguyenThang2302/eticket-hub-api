import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { EventService } from './event.service';
import { JwtAuthGuard, RolesGuard } from '../common/guard';
import { OrganizeGuard } from '../common/guard/organnize.guard';
import { UserEventOrganizeGuard } from '../common/guard/user-event-organize.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { ROLE } from '../common/constants';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get('search')
  @HttpCode(HttpStatus.OK)
  async searchEvents(@Query() params: any) {
    return await this.eventService.searchEvents(params);
  }

  @Get(':event_id')
  @HttpCode(HttpStatus.OK)
  async getEventDetails(@Param('event_id') eventId: string) {
    return await this.eventService.getEventDetails(eventId);
  }

  @Get(':event_id/seats')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getEventSeats(@Param('event_id') eventId: string) {
    return await this.eventService.getEventSeats(eventId);
  }

  @Put(':event_id/change-status-scan')
  @Roles(ROLE.PROMOTER)
  @UseGuards(OrganizeGuard, JwtAuthGuard, RolesGuard, UserEventOrganizeGuard)
  @HttpCode(HttpStatus.OK)
  async changeStatusScan(@Param('event_id') eventId: string) {
    return await this.eventService.changeStatusScan(eventId);
  }
}
