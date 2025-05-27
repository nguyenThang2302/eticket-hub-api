import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ROLE } from '../common/constants';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard, RolesGuard } from '../common/guard';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('events/:id/approve')
  @Roles(ROLE.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.OK)
  async approveEvent(@Param('id') id: string) {
    return await this.adminService.approveEvent(id);
  }

  @Post('events/:id/reject')
  @Roles(ROLE.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.OK)
  async rejectEvent(@Param('id') id: string) {
    return await this.adminService.rejectEvent(id);
  }

  @Get('events')
  @Roles(ROLE.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.OK)
  async getAllEvents(@Query() params: any) {
    return await this.adminService.getAllEvents(params);
  }

  @Get('organizers')
  @Roles(ROLE.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.OK)
  async getAllOrganizers(@Query() params: any) {
    return await this.adminService.getAllOrganizers(params);
  }

  @Get('orders')
  @Roles(ROLE.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.OK)
  async getAllOrders(@Query() params: any) {
    return await this.adminService.getAllOrders(params);
  }

  @Get('orders/:id')
  @Roles(ROLE.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.OK)
  async getOrderById(@Param('id') id: string) {
    return await this.adminService.getOrderById(id);
  }

  @Get('tickets')
  @Roles(ROLE.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.OK)
  async getAllTickets(@Query() params: any) {
    return await this.adminService.getAllTickets(params);
  }
}
