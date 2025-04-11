import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtPayload } from 'jsonwebtoken';
import { PurchaseService } from './purchase.service';
import { CalculatePriceRequestDto } from './dto/calculate-price-request.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../common/guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

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
}
