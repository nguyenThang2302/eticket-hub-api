import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsDateString,
  IsEnum,
} from 'class-validator';
import { COUPON_TYPE } from 'src/api/common/constants';

export class CreateCouponDto {
  @IsNotEmpty()
  @IsString()
  event_id: string;

  @IsNotEmpty()
  @IsString()
  campaign_name: string;

  @IsNotEmpty()
  @IsEnum(COUPON_TYPE, {
    message: 'type must be either "percentage" or "fixed"',
  })
  type: string;

  @IsNotEmpty()
  @IsString()
  code: string;

  @IsOptional()
  @IsNumber()
  percent: number;

  @IsOptional()
  @IsDateString()
  start_datetime: string;

  @IsOptional()
  @IsDateString()
  end_datetime: string;
}
