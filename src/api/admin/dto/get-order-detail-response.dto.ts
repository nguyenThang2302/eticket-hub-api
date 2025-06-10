import { ApiProperty } from '@nestjs/swagger';

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

  @ApiProperty({ description: 'Venue details of the event', type: VenueDto })
  venue: VenueDto | null;
}

class SeatInfoDto {
  @ApiProperty({ description: 'Seat location', example: 'Row A, Seat 1' })
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

export class GetOrderDetailResponseDto {
  @ApiProperty({ description: 'Unique identifier of the order', example: '1' })
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
    description: 'Discount price applied to the order',
    example: 10,
  })
  discount_price: number;

  @ApiProperty({ description: 'Subtotal price of the order', example: 90 })
  sub_total_price: number;

  @ApiProperty({ description: 'Total price of the order', example: 100 })
  total_price: number;

  @ApiProperty({
    description: 'Event details associated with the order',
    type: EventDto,
    nullable: true,
  })
  event: EventDto | null;

  @ApiProperty({
    description: 'Seat information for the order',
    type: [SeatInfoDto],
  })
  seat_info: SeatInfoDto[];

  @ApiProperty({ description: 'Status of the order', example: 'COMPLETED' })
  status: string;

  @ApiProperty({
    description: 'Date when the order was created',
    example: '2023-10-01T12:00:00Z',
  })
  created_at: Date;
}
