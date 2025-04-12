import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtPayload } from 'jsonwebtoken';
import { PurchaseService } from './purchase.service';
import { CalculatePriceRequestDto } from './dto/calculate-price-request.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../common/guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { HoldOrderDto } from './dto/hold-order.dto';

@Controller('purchases')
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {}

  @Post('calculate-price')
  @HttpCode(HttpStatus.OK)
  async calculatePrices(@Body() body: CalculatePriceRequestDto) {
    return await this.purchaseService.calculatePrices(body);
  }

  @Post('')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: CreateOrderDto, @CurrentUser() user: JwtPayload) {
    const userId = user.sub;
    return await this.purchaseService.create(body, userId);
  }

  @Post('hold')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async hold(@Body() body: HoldOrderDto, @CurrentUser() user: JwtPayload) {
    const userId = user.sub;
    return await this.purchaseService.hold(body, userId);
  }

  @Put(':payment_order_id/capture')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async capture(
    @Param('payment_order_id') paymentOrderId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    const userId = user.sub;
    return await this.purchaseService.captureOrder(paymentOrderId, userId);
  }

  @Delete(':payment_order_id/cancel')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async cancel(
    @Param('payment_order_id') paymentOrderId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    const userId = user.sub;
    return await this.purchaseService.cancelOrder(paymentOrderId, userId);
  }
}
