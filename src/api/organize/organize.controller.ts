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
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import { CreateOrganizeDto } from './dto/create-organize.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { ROLE } from '../common/constants';
import { JwtAuthGuard, RolesGuard } from '../common/guard';
import { OrganizeService } from './organize.service';
import { OrganizeGuard } from '../common/guard/organnize.guard';
import { UserInOrganize } from '../common/guard/user-in-organize.guard';
import { UserEventOrganizeGuard } from '../common/guard/user-event-organize.guard';
import { CurrentOrganizer } from '../common/decorators/current-organizer.decorator';
import { plainToInstance } from 'class-transformer';
import { UpdateEventRequestDto } from './dto/update-event-organizer.dto';
import { validate } from 'class-validator';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('organizes')
export class OrganizeController {
  constructor(private readonly organizeService: OrganizeService) {}

  @Get('tickets/:event_id')
  @Roles(ROLE.PROMOTER)
  @UseGuards(OrganizeGuard, JwtAuthGuard, RolesGuard, UserEventOrganizeGuard)
  @HttpCode(HttpStatus.OK)
  async getTickets(
    @CurrentOrganizer() organizer: any,
    @Param('event_id') eventId: string,
  ) {
    const organizeId = organizer.organizeId;
    return await this.organizeService.getTickets(organizeId, eventId);
  }

  @Roles(ROLE.PROMOTER, ROLE.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file'))
  @Post('registration')
  async registerOrganization(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
    @Body('data') data: string,
  ): Promise<any> {
    const parsedData = JSON.parse(data);
    const dto = plainToInstance(CreateOrganizeDto, parsedData);

    const errors = await validate(dto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
    const promoterId = req.user['sub'];
    const languageCode = req.headers['accept-language'] || 'en';
    return this.organizeService.registerOrganization(
      promoterId,
      languageCode,
      parsedData,
      file,
    );
  }

  @Roles(ROLE.PROMOTER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Get()
  async getOrganizations(@Req() req: Request): Promise<any> {
    const userId = req.user['sub'];
    const languageCode = req.headers['accept-language'];
    return this.organizeService.getOrganizations(userId, languageCode);
  }

  @Roles(ROLE.PROMOTER)
  @UseGuards(OrganizeGuard, JwtAuthGuard, RolesGuard, UserInOrganize)
  @HttpCode(HttpStatus.OK)
  @Get('events')
  async getEvents(@Req() req: Request, @Query() params: any): Promise<any> {
    const organizeId = req['auth']['organizeConfig']['organizeId'];
    return this.organizeService.getEvents(organizeId, params);
  }

  @Roles(ROLE.PROMOTER)
  @UseGuards(
    OrganizeGuard,
    JwtAuthGuard,
    RolesGuard,
    UserInOrganize,
    UserEventOrganizeGuard,
  )
  @HttpCode(HttpStatus.OK)
  @Get('events/:event_id')
  async getEventByOrganizer(
    @CurrentOrganizer() organizer: any,
    @Param('event_id') eventId: string,
  ): Promise<any> {
    const organizeId = organizer.organizeId;
    return this.organizeService.getEventByOrganizer(organizeId, eventId);
  }

  @Roles(ROLE.PROMOTER)
  @UseGuards(
    OrganizeGuard,
    JwtAuthGuard,
    RolesGuard,
    UserInOrganize,
    UserEventOrganizeGuard,
  )
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(HttpStatus.OK)
  @Put('events/:event_id')
  async updateEventByOrganizer(
    @CurrentOrganizer() organizer: any,
    @Param('event_id') eventId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('data') data: string,
  ): Promise<any> {
    const parsedData = JSON.parse(data);
    const dto = plainToInstance(UpdateEventRequestDto, parsedData);

    const errors = await validate(dto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
    const organizeId = organizer.organizeId;
    return this.organizeService.updateEventByOrganizer(
      organizeId,
      eventId,
      dto,
      file,
    );
  }

  @Roles(ROLE.PROMOTER)
  @UseGuards(
    OrganizeGuard,
    JwtAuthGuard,
    RolesGuard,
    UserInOrganize,
    UserEventOrganizeGuard,
  )
  @HttpCode(HttpStatus.OK)
  @Get('events/:event_id/orders/:order_id')
  async getOrderByOrganizer(@Param('order_id') orderId: string): Promise<any> {
    return this.organizeService.getOrderByOrganizer(orderId);
  }

  @Roles(ROLE.PROMOTER)
  @UseGuards(
    OrganizeGuard,
    JwtAuthGuard,
    RolesGuard,
    UserInOrganize,
    UserEventOrganizeGuard,
  )
  @HttpCode(HttpStatus.OK)
  @Get('events/:event_id/order-reports')
  async getOrderReports(
    @CurrentOrganizer() organizer: any,
    @Param('event_id') eventId: string,
    @Query() params: any,
  ): Promise<any> {
    const organizeId = organizer.organizeId;
    return this.organizeService.getOrderReports(organizeId, eventId, params);
  }

  @Roles(ROLE.PROMOTER)
  @UseGuards(
    OrganizeGuard,
    JwtAuthGuard,
    RolesGuard,
    UserInOrganize,
    UserEventOrganizeGuard,
  )
  @HttpCode(HttpStatus.OK)
  @Get('events/:event_id/ticket-reports')
  async getTicketReport(
    @CurrentOrganizer() organizer: any,
    @Param('event_id') eventId: string,
    @Query() params: any,
  ): Promise<any> {
    const organizeId = organizer.organizeId;
    return this.organizeService.getTicketReport(organizeId, eventId, params);
  }

  @Roles(ROLE.PROMOTER)
  @UseGuards(
    OrganizeGuard,
    JwtAuthGuard,
    RolesGuard,
    UserInOrganize,
    UserEventOrganizeGuard,
  )
  @HttpCode(HttpStatus.OK)
  @Get('events/:event_id/gross-sales')
  async getGrossSales(
    @CurrentOrganizer() organizer: any,
    @Param('event_id') eventId: string,
    @Query('start_date') startDate: string,
    @Query('end_date') endDate: string,
  ): Promise<any> {
    const organizeId = organizer.organizeId;
    return this.organizeService.getGrossSales(
      organizeId,
      eventId,
      startDate,
      endDate,
    );
  }

  @Roles(ROLE.PROMOTER)
  @UseGuards(
    OrganizeGuard,
    JwtAuthGuard,
    RolesGuard,
    UserInOrganize,
    UserEventOrganizeGuard,
  )
  @HttpCode(HttpStatus.OK)
  @Get('events/:event_id/sold-ticket')
  async getSoldTicket(
    @CurrentOrganizer() organizer: any,
    @Param('event_id') eventId: string,
    @Query('start_date') startDate: string,
    @Query('end_date') endDate: string,
  ): Promise<any> {
    const organizeId = organizer.organizeId;
    return this.organizeService.getSoldTicket(
      organizeId,
      eventId,
      startDate,
      endDate,
    );
  }

  @Roles(ROLE.PROMOTER)
  @UseGuards(
    OrganizeGuard,
    JwtAuthGuard,
    RolesGuard,
    UserInOrganize,
    UserEventOrganizeGuard,
  )
  @HttpCode(HttpStatus.OK)
  @Get('events/:event_id/summary-tickets')
  async getSummaryTickets(
    @CurrentOrganizer() organizer: any,
    @Param('event_id') eventId: string,
  ): Promise<any> {
    const organizeId = organizer.organizeId;
    return this.organizeService.getSummaryTickets(organizeId, eventId);
  }

  @Roles(ROLE.PROMOTER)
  @UseGuards(
    OrganizeGuard,
    JwtAuthGuard,
    RolesGuard,
    UserInOrganize,
    UserEventOrganizeGuard,
  )
  @HttpCode(HttpStatus.OK)
  @Get('events/:event_id/check-in-reports')
  async getCheckInEventReport(
    @CurrentOrganizer() organizer: any,
    @Param('event_id') eventId: string,
  ): Promise<any> {
    const organizeId = organizer.organizeId;
    return this.organizeService.getCheckInEventReport(organizeId, eventId);
  }
}
