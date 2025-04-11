import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { CalculatePriceRequestDto } from './dto/calculate-price-request.dto';

@Controller('purchases')
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {}

  @Post('calculate-price')
  @HttpCode(HttpStatus.OK)
  async calculatePrices(@Body() body: CalculatePriceRequestDto) {
    return await this.purchaseService.calculatePrices(body);
  }
}
