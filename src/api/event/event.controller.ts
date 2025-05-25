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
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
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
import { ApiCommonHeaders } from '../common/decorators/api-common-header.decorator';

@ApiTags('Events')
@ApiBearerAuth()
@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get('specials')
  @HttpCode(HttpStatus.OK)
  async getSpecialEvents() {
    return await this.eventService.getSpecialEvents();
  }

  @Get('trendings')
  @HttpCode(HttpStatus.OK)
  async getTrendingEvents() {
    return await this.eventService.getTrendingEvents();
  }

  @Post()
  @Roles(ROLE.PROMOTER)
  @ApiCommonHeaders()
  @UseGuards(OrganizeGuard, JwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Create a new event' })
  @ApiBody({ description: 'Event data', type: CreateEventRequestDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Event created successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation failed',
  })
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

  @Get('pending')
  @ApiCommonHeaders()
  @Roles(ROLE.PROMOTER)
  @UseGuards(OrganizeGuard, JwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get pending events' })
  @ApiResponse({ status: HttpStatus.OK, description: 'List of pending events' })
  async getPendingEvents(
    @CurrentOrganizer() organizer: any,
    @Query() params: any,
  ) {
    const organizeId = organizer.organizeId;
    return await this.eventService.getPendingEvents(organizeId, params);
  }

  @Get('upcoming')
  @Roles(ROLE.PROMOTER)
  @ApiCommonHeaders()
  @UseGuards(OrganizeGuard, JwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get upcoming events' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of upcoming events',
  })
  async getUpcomingEvents(
    @CurrentOrganizer() organizer: any,
    @Query() params: any,
  ) {
    const organizeId = organizer.organizeId;
    return await this.eventService.getUpcomingEvents(organizeId, params);
  }

  @Get('past')
  @Roles(ROLE.PROMOTER)
  @UseGuards(OrganizeGuard, JwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get past events' })
  @ApiResponse({ status: HttpStatus.OK, description: 'List of past events' })
  async getPastEvents(
    @CurrentOrganizer() organizer: any,
    @Query() params: any,
  ) {
    const organizeId = organizer.organizeId;
    return await this.eventService.getPastEvents(organizeId, params);
  }

  @Get('rejected')
  @Roles(ROLE.PROMOTER)
  @UseGuards(OrganizeGuard, JwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get rejected events' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of rejected events',
  })
  async getEventRejected(
    @CurrentOrganizer() organizer: any,
    @Query() params: any,
  ) {
    const organizeId = organizer.organizeId;
    return await this.eventService.getRejectedEvents(organizeId, params);
  }

  @Get('search')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Search events' })
  @ApiQuery({
    name: 'params',
    description: 'Search parameters',
    required: false,
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'Search results' })
  async searchEvents(@Query() params: any) {
    return await this.eventService.searchEvents(params);
  }

  @Get(':event_id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get event details' })
  @ApiParam({ name: 'event_id', description: 'Event ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Event details' })
  async getEventDetails(@Param('event_id') eventId: string) {
    return await this.eventService.getEventDetails(eventId);
  }

  @Get(':event_id/seats')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get event seats' })
  @ApiParam({ name: 'event_id', description: 'Event ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Event seats' })
  async getEventSeats(@Param('event_id') eventId: string) {
    return await this.eventService.getEventSeats(eventId);
  }

  @Put(':event_id/change-status-scan')
  @Roles(ROLE.PROMOTER)
  @ApiCommonHeaders()
  @UseGuards(OrganizeGuard, JwtAuthGuard, RolesGuard, UserEventOrganizeGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Change event scan status' })
  @ApiParam({ name: 'event_id', description: 'Event ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Scan status updated' })
  async changeStatusScan(@Param('event_id') eventId: string) {
    return await this.eventService.changeStatusScan(eventId);
  }
}
