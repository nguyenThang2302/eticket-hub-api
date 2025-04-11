import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentMethod } from 'src/database/entities/payment-method.entity';
import { Repository } from 'typeorm';
import {
  ListPaymentMethodResponseDto,
  ListPaymentMethodResponseWrapperDto,
} from './dto/get-payment-method-response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class PaymentMethodService {
  constructor(
    @InjectRepository(PaymentMethod)
    private readonly paymentMethodRepository: Repository<PaymentMethod>,
  ) {}

  async getAllPaymentMethods(): Promise<ListPaymentMethodResponseWrapperDto> {
    const paymentMethods = await this.paymentMethodRepository.find();

    const items = plainToInstance(
      ListPaymentMethodResponseDto,
      paymentMethods,
      {
        excludeExtraneousValues: true,
      },
    );

    return plainToInstance(
      ListPaymentMethodResponseWrapperDto,
      { items },
      {
        excludeExtraneousValues: true,
      },
    );
  }

  async getPaymentMethodNameById(id: string) {
    const paymentMethodName = await this.paymentMethodRepository.findOneBy({
      id,
    });

    if (!paymentMethodName) {
      throw new NotFoundException('PAYMENT_METHOD_NOT_FOUND');
    }

    return paymentMethodName.name;
  }
}
