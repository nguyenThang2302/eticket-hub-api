import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class AddressDto {
  @ApiProperty({ description: 'Name of the address' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'City of the address' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ description: 'District of the address' })
  @IsString()
  @IsNotEmpty()
  district: string;

  @ApiProperty({ description: 'Ward of the address' })
  @IsString()
  @IsNotEmpty()
  ward: string;

  @ApiProperty({ description: 'Street of the address' })
  @IsString()
  @IsNotEmpty()
  street: string;
}

class TicketDto {
  @ApiPropertyOptional({ description: 'ID of the ticket (optional)' })
  @IsOptional()
  id: string;

  @ApiProperty({ description: 'Name of the ticket' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Price of the ticket' })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({ description: 'Quantity of the ticket' })
  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @ApiProperty({
    description: 'Minimum quantity of tickets that can be purchased',
  })
  @IsNumber()
  @IsNotEmpty()
  min_quantity: number;

  @ApiProperty({
    description: 'Maximum quantity of tickets that can be purchased',
  })
  @IsNumber()
  @IsNotEmpty()
  max_quantity: number;
}

export class UpdateEventRequestDto {
  @ApiProperty({ description: 'Name of the event' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Type of the event' })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({
    description: 'Address details of the event',
    type: AddressDto,
  })
  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;

  @ApiProperty({ description: 'Category of the event' })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiPropertyOptional({ description: 'Description of the event (optional)' })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({
    description: 'Start date and time of the event (ISO 8601 format)',
  })
  @IsString()
  @IsNotEmpty()
  start_datetime: string;

  @ApiProperty({
    description: 'End date and time of the event (ISO 8601 format)',
  })
  @IsString()
  @IsNotEmpty()
  end_datetime: string;

  @ApiProperty({
    description: 'List of tickets for the event',
    type: [TicketDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TicketDto)
  tickets: TicketDto[];

  @ApiProperty({ description: 'Privacy setting of the event' })
  @IsString()
  @IsNotEmpty()
  privacy: string;

  @ApiProperty({ description: 'Account owner name for payment' })
  @IsString()
  @IsNotEmpty()
  account_owner: string;

  @ApiProperty({ description: 'Account number for payment' })
  @IsString()
  @IsNotEmpty()
  account_number: string;

  @ApiProperty({ description: 'Bank name for payment' })
  @IsString()
  @IsNotEmpty()
  bank: string;

  @ApiProperty({ description: 'Business type of the organizer' })
  @IsString()
  @IsNotEmpty()
  business_type: string;

  @ApiProperty({ description: 'Full name of the organizer' })
  @IsString()
  @IsNotEmpty()
  full_name: string;

  @ApiProperty({ description: 'Business address of the organizer' })
  @IsString()
  @IsNotEmpty()
  address_business: string;

  @ApiProperty({ description: 'Tax code of the organizer' })
  @IsString()
  @IsNotEmpty()
  tax_code: string;
}
