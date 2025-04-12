import {
  IsNotEmpty,
  IsString,
  IsObject,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';

class TicketDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  price: string;
}

class SeatDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  row: string;

  @IsString()
  @IsNotEmpty()
  label: string;

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

export class HoldOrderDto {
  @IsString()
  @IsNotEmpty()
  event_id: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SeatDto)
  seats: SeatDto[];
}
