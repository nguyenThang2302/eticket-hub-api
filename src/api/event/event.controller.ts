import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { EventService } from './event.service';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get(':event_id')
  @HttpCode(HttpStatus.OK)
  async getEventDetails(@Param('event_id') eventId: string) {
    return await this.eventService.getEventDetails(eventId);
  }
}
