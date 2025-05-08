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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { Roles } from '../common/decorators/roles.decorator';
import { ROLE } from '../common/constants';
import { JwtAuthGuard, RolesGuard } from '../common/guard';
import { OrganizeGuard } from '../common/guard/organnize.guard';
import { UserEventOrganizeGuard } from '../common/guard/user-event-organize.guard';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { CouponService } from './coupon.service';
import { ApiCommonHeaders } from '../common/decorators/api-common-header.decorator';

@ApiTags('coupons')
@Controller('coupons')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @ApiOperation({ summary: 'Retrieve a list of coupons for an event' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of coupons retrieved successfully',
  })
  @ApiParam({
    name: 'event_id',
    description: 'ID of the event',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiCommonHeaders()
  @Get(':event_id')
  @Roles(ROLE.PROMOTER)
  @UseGuards(OrganizeGuard, JwtAuthGuard, RolesGuard, UserEventOrganizeGuard)
  @HttpCode(HttpStatus.OK)
  async getCouponList(@Param('event_id') eventId: string) {
    return await this.couponService.getListCouponByEvent(eventId);
  }

  @ApiOperation({ summary: 'Change the status of a coupon' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Coupon status updated successfully',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the coupon',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @ApiParam({
    name: 'event_id',
    description: 'ID of the event',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Put(':id/:event_id/change-status')
  @ApiCommonHeaders()
  @Roles(ROLE.PROMOTER)
  @UseGuards(OrganizeGuard, JwtAuthGuard, RolesGuard, UserEventOrganizeGuard)
  @HttpCode(HttpStatus.OK)
  async changeStatusCoupon(
    @Param('id') id: string,
    @Param('event_id') eventId: string,
  ) {
    return await this.couponService.changeStatusCoupon(id, eventId);
  }

  @ApiOperation({ summary: 'Retrieve details of a specific coupon' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Coupon details retrieved successfully',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the coupon',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @ApiParam({
    name: 'event_id',
    description: 'ID of the event',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Get(':id/:event_id')
  @ApiCommonHeaders()
  @Roles(ROLE.PROMOTER)
  @UseGuards(OrganizeGuard, JwtAuthGuard, RolesGuard, UserEventOrganizeGuard)
  @HttpCode(HttpStatus.OK)
  async getCouponDetail(
    @Param('id') id: string,
    @Param('event_id') eventId: string,
  ) {
    return await this.couponService.getCouponDetail(id, eventId);
  }

  @ApiOperation({ summary: 'Delete a coupon' })
  @ApiCommonHeaders()
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Coupon deleted successfully',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the coupon',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @ApiParam({
    name: 'event_id',
    description: 'ID of the event',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
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

  @ApiOperation({ summary: 'Create a new coupon' })
  @ApiCommonHeaders()
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Coupon created successfully',
  })
  @ApiBody({ type: CreateCouponDto })
  @Post()
  @Roles(ROLE.PROMOTER)
  @UseGuards(OrganizeGuard, JwtAuthGuard, RolesGuard, UserEventOrganizeGuard)
  @HttpCode(HttpStatus.CREATED)
  async createCoupon(@Body() createCouponDto: CreateCouponDto) {
    return await this.couponService.createCoupon(createCouponDto);
  }

  @ApiOperation({ summary: 'Update an existing coupon' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Coupon updated successfully',
  })
  @ApiParam({
    name: 'id',
    description: 'ID of the coupon',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @ApiCommonHeaders()
  @ApiBody({ type: CreateCouponDto })
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
