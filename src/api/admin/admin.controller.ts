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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ROLE } from '../common/constants';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard, RolesGuard } from '../common/guard';
import { AdminService } from './admin.service';
import { ApproveEventResponseDto } from './dto/approve-event.dto';
import { RejectEventResponseDto } from './dto/reject-event.dto';
import { GetAllEventsResponseDto } from './dto/get-all-event-reponse.dto';
import { GetAllOrganizersResponseDto } from './dto/get-all-roganizer-response.dto';
import { GetAllOrdersResponseDto } from './dto/get-all-order-response.dto';
import { GetOrderDetailResponseDto } from './dto/get-order-detail-response.dto';
import { GetAllTicketsResponseDto } from './dto/get-all-ticket-response.dto';
import { ApiCommonResponses } from '../common/decorators/api-common-response.decorator';

@ApiTags('Admin')
@ApiBearerAuth()
@Controller('admin')
@ApiCommonResponses()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('events/:id/approve')
  @Roles(ROLE.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Approve an event by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ApproveEventResponseDto,
    description: 'Event approved successfully',
  })
  async approveEvent(@Param('id') id: string) {
    return await this.adminService.approveEvent(id);
  }

  @Post('events/:id/reject')
  @Roles(ROLE.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reject an event by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: RejectEventResponseDto,
    description: 'Event rejected successfully',
  })
  async rejectEvent(@Param('id') id: string) {
    return await this.adminService.rejectEvent(id);
  }

  @Get('events')
  @Roles(ROLE.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all events' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetAllEventsResponseDto,
    description: 'List of all events',
  })
  async getAllEvents(@Query() params: any) {
    return await this.adminService.getAllEvents(params);
  }

  @Get('organizers')
  @Roles(ROLE.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all organizers' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetAllOrganizersResponseDto,
    description: 'List of all organizers',
  })
  async getAllOrganizers(@Query() params: any) {
    return await this.adminService.getAllOrganizers(params);
  }

  @Get('orders')
  @Roles(ROLE.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all orders' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetAllOrdersResponseDto,
    description: 'List of all orders',
  })
  async getAllOrders(@Query() params: any) {
    return await this.adminService.getAllOrders(params);
  }

  @Get('orders/:id')
  @Roles(ROLE.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get order details by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetOrderDetailResponseDto,
    description: 'Order details retrieved successfully',
  })
  async getOrderById(@Param('id') id: string) {
    return await this.adminService.getOrderById(id);
  }

  @Get('tickets')
  @Roles(ROLE.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all tickets' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetAllTicketsResponseDto,
    description: 'List of all tickets',
  })
  async getAllTickets(@Query() params: any) {
    return await this.adminService.getAllTickets(params);
  }

  @Get('analytics/event-categories')
  @Roles(ROLE.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get analytics categories' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Analytics categories retrieved successfully',
  })
  async getAnalyticsEventCategories(@Query() params: any) {
    return await this.adminService.getAnalyticsEventCategories(params);
  }

  @Get('analytics/event-status')
  @Roles(ROLE.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get analytics event status' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Analytics event status retrieved successfully',
  })
  async getAnalyticsEventStatus(@Query() params: any) {
    return await this.adminService.getAnalyticsEventStatus(params);
  }

  @Get('analytics/ticket-sales')
  @Roles(ROLE.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get analytics ticket sales' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Analytics ticket sales retrieved successfully',
  })
  async getAnalyticsTicketSales(@Query() params: any) {
    return await this.adminService.getAnalyticsTicketSales(params);
  }

  @Get('analytics/event-sales')
  @Roles(ROLE.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get analytics event sales' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Analytics event sales retrieved successfully',
  })
  async getAnalyticsEventSales(@Query() params: any) {
    return await this.adminService.getAnalyticsEventSales(params);
  }
}
