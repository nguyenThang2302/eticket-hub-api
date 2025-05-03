import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { SeatService } from './seat.service';
import { CreateSeatDto } from './dto/create-seat.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { ROLE } from '../common/constants';
import { OrganizeGuard } from '../common/guard/organnize.guard';
import { JwtAuthGuard, RolesGuard } from '../common/guard';
import { UserEventOrganizeGuard } from '../common/guard/user-event-organize.guard';
import { CreateSeatMapDto } from './dto/create-seat-map.dto';

@Controller('seats')
export class SeatController {
  constructor(private readonly seatService: SeatService) {}

  @Get(':event_id/initials')
  @Roles(ROLE.PROMOTER)
  @UseGuards(OrganizeGuard, JwtAuthGuard, RolesGuard, UserEventOrganizeGuard)
  @HttpCode(HttpStatus.OK)
  async getSeatMapInitials(@Param('event_id') eventId: string) {
    return this.seatService.getSeatMapInitials(eventId);
  }

  @Post(':event_id')
  @Roles(ROLE.PROMOTER)
  @UseGuards(OrganizeGuard, JwtAuthGuard, RolesGuard, UserEventOrganizeGuard)
  @HttpCode(HttpStatus.CREATED)
  async createSeats(
    @Body() body: CreateSeatDto,
    @Param('event_id') eventId: string,
  ) {
    return this.seatService.createSeats(body, eventId);
  }

  @Put(':event_id/map')
  @Roles(ROLE.PROMOTER)
  @UseGuards(OrganizeGuard, JwtAuthGuard, RolesGuard, UserEventOrganizeGuard)
  @HttpCode(HttpStatus.CREATED)
  async createSeatsMap(
    @Body() body: CreateSeatMapDto,
    @Param('event_id') eventId: string,
  ) {
    return this.seatService.createSeatsMap(body, eventId);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getSeats() {
    return this.seatService.getSeats();
  }
}
