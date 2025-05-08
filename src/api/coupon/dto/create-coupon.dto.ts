import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsDateString,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { COUPON_TYPE } from 'src/api/common/constants';

export class CreateCouponDto {
  @ApiProperty({
    description: 'ID of the event associated with the coupon',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  @IsString()
  event_id: string;

  @ApiProperty({
    description: 'Name of the campaign',
    example: 'Black Friday Sale',
  })
  @IsNotEmpty()
  @IsString()
  campaign_name: string;

  @ApiProperty({
    description: 'Type of the coupon',
    enum: COUPON_TYPE,
    example: 'percentage',
  })
  @IsNotEmpty()
  @IsEnum(COUPON_TYPE, {
    message: 'type must be either "percentage" or "fixed"',
  })
  type: string;

  @ApiProperty({
    description: 'Unique code for the coupon',
    example: 'BLACKFRIDAY2023',
  })
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiProperty({
    description: 'Discount percentage (required if type is "percentage")',
    example: 20,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  percent: number;

  @ApiProperty({
    description: 'Start date and time of the coupon validity',
    example: '2023-11-01T00:00:00Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  start_datetime: string;

  @ApiProperty({
    description: 'End date and time of the coupon validity',
    example: '2023-11-30T23:59:59Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  end_datetime: string;
}
