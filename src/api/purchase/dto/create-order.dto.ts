import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsObject,
  IsArray,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

class ReceiveInfoDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  phone_number: string;

  @IsString()
  @IsNotEmpty()
  email: string;
}

class TicketDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;
}

class SeatDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsObject()
  @ValidateNested()
  @Type(() => TicketDto)
  ticket: TicketDto;
}

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  event_id: string;

  @IsString()
  @IsNotEmpty()
  payment_method_id: string;

  @IsObject()
  @ValidateNested()
  @Type(() => ReceiveInfoDto)
  receive_infos: ReceiveInfoDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SeatDto)
  seats: SeatDto[];

  @IsOptional()
  @IsString()
  coupon_code: string | null;

  @IsNumber()
  @IsNotEmpty()
  discount_price: number;

  @IsNumber()
  @IsNotEmpty()
  sub_total_price: number;

  @IsNumber()
  @IsNotEmpty()
  total_price: number;
}
