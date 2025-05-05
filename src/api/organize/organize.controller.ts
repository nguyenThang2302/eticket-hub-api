import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
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

@Controller('organizes')
export class OrganizeController {
  constructor(private readonly organizeService: OrganizeService) {}

  @Roles(ROLE.PROMOTER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async registerOrganization(
    @Req() req: Request,
    @Body() body: CreateOrganizeDto,
  ): Promise<any> {
    const promoterId = req.user['sub'];
    const languageCode = req.headers['accept-language'];
    return this.organizeService.registerOrganization(
      promoterId,
      languageCode,
      body,
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
  async getEvent(
    @CurrentOrganizer() organizer: any,
    @Param('event_id') eventId: string,
  ): Promise<any> {
    const organizeId = organizer.organizeId;
    return this.organizeService.getEventByOrganizer(organizeId, eventId);
  }
}
