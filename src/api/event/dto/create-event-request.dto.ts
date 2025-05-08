import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class AddressDto {
  @ApiProperty({ description: 'Name of the address', example: 'Main Street' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'City of the address', example: 'New York' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ description: 'District of the address', example: 'Manhattan' })
  @IsString()
  @IsNotEmpty()
  district: string;

  @ApiProperty({ description: 'Ward of the address', example: 'Ward 1' })
  @IsString()
  @IsNotEmpty()
  ward: string;

  @ApiProperty({ description: 'Street of the address', example: '5th Avenue' })
  @IsString()
  @IsNotEmpty()
  street: string;
}

class TicketDto {
  @ApiProperty({ description: 'Name of the ticket', example: 'VIP Ticket' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Price of the ticket', example: 100 })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({ description: 'Quantity of the ticket', example: 50 })
  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @ApiProperty({ description: 'Minimum quantity per purchase', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  min_quantity: number;

  @ApiProperty({ description: 'Maximum quantity per purchase', example: 5 })
  @IsNumber()
  @IsNotEmpty()
  max_quantity: number;
}

export class CreateEventRequestDto {
  @ApiProperty({
    description: 'Name of the event',
    example: 'Music Festival 2023',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Type of the event', example: 'Music' })
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

  @ApiProperty({ description: 'Category of the event', example: 'Concert' })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({
    description: 'Description of the event',
    example: 'A grand music festival.',
    required: false,
  })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({
    description: 'Start date and time of the event',
    example: '2023-11-01T18:00:00Z',
  })
  @IsString()
  @IsNotEmpty()
  start_datetime: string;

  @ApiProperty({
    description: 'End date and time of the event',
    example: '2023-11-01T23:00:00Z',
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

  @ApiProperty({ description: 'Privacy of the event', example: 'Public' })
  @IsString()
  @IsNotEmpty()
  privacy: string;

  @ApiProperty({ description: 'Account owner name', example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  account_owner: string;

  @ApiProperty({ description: 'Account number', example: '123456789' })
  @IsString()
  @IsNotEmpty()
  account_number: string;

  @ApiProperty({ description: 'Bank name', example: 'Bank of America' })
  @IsString()
  @IsNotEmpty()
  bank: string;

  @ApiProperty({ description: 'Business type', example: 'Event Management' })
  @IsString()
  @IsNotEmpty()
  business_type: string;

  @ApiProperty({
    description: 'Full name of the organizer',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  full_name: string;

  @ApiProperty({
    description: 'Business address',
    example: '123 Main Street, New York, NY',
  })
  @IsString()
  @IsNotEmpty()
  address_business: string;

  @ApiProperty({ description: 'Tax code', example: '123456789' })
  @IsString()
  @IsNotEmpty()
  tax_code: string;
}
