import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { Coupon } from 'src/database/entities/coupon.entity';

@Injectable()
export class CouponService {
  constructor(
    @InjectRepository(Coupon)
    private readonly couponRepository: Repository<Coupon>,
  ) {}

  async getCouponAvaiable(code: string) {
    const coupon = await this.couponRepository.findOne({
      where: {
        code,
        amount: MoreThan(0),
      },
    });
    return coupon;
  }
}
