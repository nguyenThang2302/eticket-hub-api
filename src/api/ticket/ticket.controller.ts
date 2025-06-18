import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard, RolesGuard } from '../common/guard';
import { Roles } from '../common/decorators/roles.decorator';
import { ROLE } from '../common/constants';
import { OrganizeGuard } from '../common/guard/organnize.guard';
import { TicketService } from './ticket.service';

@Controller('tickets')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Get('verifies')
  @Roles(ROLE.PROMOTER)
  @UseGuards(OrganizeGuard, JwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.OK)
  async verifyTicket(@Req() req: Request, @Query('code') code: string) {
    const organizeId = req['auth']['organizeConfig']['organizeId'];
    const data = await this.ticketService.verifyQRTicket(organizeId, code);
    return data;
  }

  @Get(':event_id')
  @HttpCode(HttpStatus.OK)
  async getTickets(@Param('event_id') eventId: string) {
    return await this.ticketService.getTickets(eventId);
  }
}
