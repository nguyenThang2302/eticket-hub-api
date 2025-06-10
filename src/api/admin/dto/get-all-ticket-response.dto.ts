import { ApiProperty } from '@nestjs/swagger';

class TicketImageDto {
  @ApiProperty({
    description: 'Seat location of the ticket',
    example: 'Row A, Seat 1',
  })
  location: string;

  @ApiProperty({ description: 'Name of the ticket', example: 'VIP Ticket' })
  ticket_name: string;

  @ApiProperty({ description: 'Price of the ticket', example: 100 })
  ticket_price: number;

  @ApiProperty({
    description: 'QR code URL for the ticket',
    example: 'https://example.com/qr-code.png',
  })
  ticket_url: string;

  @ApiProperty({ description: 'Ticket code', example: 'ABC123' })
  ticket_code: string;
}

class CouponDto {
  @ApiProperty({ description: 'Coupon code', example: 'DISCOUNT10' })
  code: string;

  @ApiProperty({ description: 'Discount percentage', example: 10 })
  percent: number;
}

class ReceiveInfoDto {
  @ApiProperty({ description: 'Name of the receiver', example: 'John Doe' })
  name: string;

  @ApiProperty({
    description: 'Masked email of the receiver',
    example: 'jo***@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Masked phone number of the receiver',
    example: '123****789',
  })
  phone_number: string;
}

class VenueDto {
  @ApiProperty({ description: 'Name of the venue', example: 'Grand Hall' })
  name: string;

  @ApiProperty({
    description: 'Address of the venue',
    example: '123 Main St, City, Country',
  })
  address: string;
}

class EventDto {
  @ApiProperty({ description: 'Name of the event', example: 'Music Concert' })
  name: string;

  @ApiProperty({
    description: 'Start time of the event',
    example: '2023-10-01T18:00:00Z',
  })
  start_time: Date;

  @ApiProperty({
    description: 'Venue details of the event',
    type: VenueDto,
    nullable: true,
  })
  venue: VenueDto | null;
}

class TicketDto {
  @ApiProperty({
    description: 'Unique identifier of the ticket order',
    example: '1',
  })
  id: string;

  @ApiProperty({ description: 'Tracking user ID', example: '12345' })
  tracking_user: string;

  @ApiProperty({
    description: 'Name of the payment method',
    example: 'Credit Card',
    nullable: true,
  })
  payment_method_name: string | null;

  @ApiProperty({
    description: 'Coupon details',
    type: CouponDto,
    nullable: true,
  })
  coupon: CouponDto | null;

  @ApiProperty({
    description: 'Receiver information',
    type: ReceiveInfoDto,
    nullable: true,
  })
  receive_infos: ReceiveInfoDto | null;

  @ApiProperty({
    description: 'Discount price applied to the ticket',
    example: 10,
  })
  discount_price: number;

  @ApiProperty({ description: 'Subtotal price of the ticket', example: 90 })
  sub_total_price: number;

  @ApiProperty({ description: 'Total price of the ticket', example: 100 })
  total_price: number;

  @ApiProperty({
    description: 'Event details associated with the ticket',
    type: EventDto,
    nullable: true,
  })
  event: EventDto | null;

  @ApiProperty({
    description: 'Seat information for the ticket',
    type: [TicketImageDto],
  })
  seat_info: TicketImageDto[];

  @ApiProperty({
    description: 'Status of the ticket order',
    example: 'COMPLETED',
  })
  status: string;

  @ApiProperty({
    description: 'Date when the ticket order was created',
    example: '2023-10-01T12:00:00Z',
  })
  created_at: Date;
}

class PaginationDto {
  @ApiProperty({ description: 'Total number of tickets', example: 100 })
  total: number;

  @ApiProperty({ description: 'Number of tickets per page', example: 10 })
  limit: number;

  @ApiProperty({ description: 'Current page number', example: 1 })
  page: number;

  @ApiProperty({ description: 'Current page number', example: 1 })
  current_page: number;

  @ApiProperty({ description: 'Total number of pages', example: 10 })
  total_page: number;

  @ApiProperty({
    description: 'Indicates if there is a next page',
    example: true,
  })
  has_next_page: boolean;

  @ApiProperty({
    description: 'Indicates if there is a previous page',
    example: false,
  })
  has_previous_page: boolean;

  @ApiProperty({ description: 'Next page number, if available', example: 2 })
  next_page: number | null;
}

class DataDto {
  @ApiProperty({ description: 'List of tickets', type: [TicketDto] })
  items: TicketDto[];

  @ApiProperty({ description: 'Pagination details', type: PaginationDto })
  paginations: PaginationDto;
}

export class GetAllTicketsResponseDto {
  @ApiProperty({
    description: 'Response data containing items and paginations',
    type: DataDto,
  })
  data: DataDto;
}
