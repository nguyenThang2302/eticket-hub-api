import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { EventService } from './event.service';
import { JwtAuthGuard, RolesGuard } from '../common/guard';
import { OrganizeGuard } from '../common/guard/organnize.guard';
import { UserEventOrganizeGuard } from '../common/guard/user-event-organize.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { ROLE } from '../common/constants';
import { CreateEventRequestDto } from './dto/create-event-request.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CurrentOrganizer } from '../common/decorators/current-organizer.decorator';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  @Roles(ROLE.PROMOTER)
  @UseGuards(OrganizeGuard, JwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file'))
  async createEvent(
    @CurrentOrganizer() organizer: any,
    @UploadedFile() file: Express.Multer.File,
    @Body('data') data: string,
  ) {
    const organizeId = organizer.organizeId;
    const parsedData = JSON.parse(data);
    const dto = plainToInstance(CreateEventRequestDto, parsedData);

    const errors = await validate(dto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
    return await this.eventService.createEvent(organizeId, parsedData, file);
  }

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
