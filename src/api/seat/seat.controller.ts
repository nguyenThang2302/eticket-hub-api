import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { SeatService } from './seat.service';
import { CreateSeatDto } from './dto/create-seat.dto';

@Controller('seats')
export class SeatController {
  constructor(private readonly seatService: SeatService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getSeats() {
    return this.seatService.getSeats();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createSeat(@Body() body: CreateSeatDto) {
    return this.seatService.createSeat(body);
  }
}
