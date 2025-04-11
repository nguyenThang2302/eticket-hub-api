import {
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class TicketDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  price: string;
}

class SeatDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  type: string;

  @IsNotEmpty()
  @IsString()
  status: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => TicketDto)
  ticket: TicketDto;
}

export class CalculatePriceRequestDto {
  @IsNotEmpty()
  @IsString()
  event_id: string;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => SeatDto)
  seats: SeatDto[];

  @IsOptional()
  @IsString()
  coupon_code: string | null;
}
