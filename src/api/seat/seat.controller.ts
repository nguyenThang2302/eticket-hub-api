import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { SeatService } from './seat.service';

@Controller('seats')
export class SeatController {
  constructor(private readonly seatService: SeatService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getSeats() {
    return this.seatService.getSeats();
  }
}
