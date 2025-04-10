import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  UseGuards,
} from '@nestjs/common';
import { EventService } from './event.service';
import { JwtAuthGuard } from '../common/guard';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

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
}
