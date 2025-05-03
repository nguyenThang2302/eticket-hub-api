import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { SeatService } from './seat.service';
import { CreateSeatDto } from './dto/create-seat.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { ROLE } from '../common/constants';
import { OrganizeGuard } from '../common/guard/organnize.guard';
import { JwtAuthGuard, RolesGuard } from '../common/guard';
import { UserEventOrganizeGuard } from '../common/guard/user-event-organize.guard';

@Controller('seats')
export class SeatController {
  constructor(private readonly seatService: SeatService) {}

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

  @Get()
  @HttpCode(HttpStatus.OK)
  async getSeats() {
    return this.seatService.getSeats();
  }
}
