import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { ROLE } from '../common/constants';
import { JwtAuthGuard, RolesGuard } from '../common/guard';
import { OrganizeGuard } from '../common/guard/organnize.guard';
import { UserEventOrganizeGuard } from '../common/guard/user-event-organize.guard';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { CouponService } from './coupon.service';

@Controller('coupons')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Get(':event_id')
  @Roles(ROLE.PROMOTER)
  @UseGuards(OrganizeGuard, JwtAuthGuard, RolesGuard, UserEventOrganizeGuard)
  @HttpCode(HttpStatus.OK)
  async getCouponList(@Param('event_id') eventId: string) {
    return await this.couponService.getListCouponByEvent(eventId);
  }

  @Put(':id/:event_id/change-status')
  @Roles(ROLE.PROMOTER)
  @UseGuards(OrganizeGuard, JwtAuthGuard, RolesGuard, UserEventOrganizeGuard)
  @HttpCode(HttpStatus.OK)
  async changeStatusCoupon(
    @Param('id') id: string,
    @Param('event_id') eventId: string,
  ) {
    return await this.couponService.changeStatusCoupon(id, eventId);
  }

  @Get(':id/:event_id')
  @Roles(ROLE.PROMOTER)
  @UseGuards(OrganizeGuard, JwtAuthGuard, RolesGuard, UserEventOrganizeGuard)
  @HttpCode(HttpStatus.OK)
  async getCouponDetail(
    @Param('id') id: string,
    @Param('event_id') eventId: string,
  ) {
    return await this.couponService.getCouponDetail(id, eventId);
  }

  @Delete(':id/:event_id')
  @Roles(ROLE.PROMOTER)
  @UseGuards(OrganizeGuard, JwtAuthGuard, RolesGuard, UserEventOrganizeGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteCoupon(
    @Param('id') id: string,
    @Param('event_id') eventId: string,
  ) {
    return await this.couponService.deleteCoupon(id, eventId);
  }

  @Post()
  @Roles(ROLE.PROMOTER)
  @UseGuards(OrganizeGuard, JwtAuthGuard, RolesGuard, UserEventOrganizeGuard)
  @HttpCode(HttpStatus.CREATED)
  async createCoupon(@Body() createCouponDto: CreateCouponDto) {
    return await this.couponService.createCoupon(createCouponDto);
  }

  @Put(':id')
  @Roles(ROLE.PROMOTER)
  @UseGuards(OrganizeGuard, JwtAuthGuard, RolesGuard, UserEventOrganizeGuard)
  @HttpCode(HttpStatus.OK)
  async updateCoupon(
    @Param('id') id: string,
    @Body() createCouponDto: CreateCouponDto,
  ) {
    return await this.couponService.updateCoupon(id, createCouponDto);
  }
}
