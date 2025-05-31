import { ApiProperty } from '@nestjs/swagger';

class TicketDto {
  @ApiProperty({ description: 'Unique identifier of the ticket', example: '1' })
  id: string;

  @ApiProperty({ description: 'Row number of the ticket', example: 'A' })
  row: string;

  @ApiProperty({ description: 'Label of the ticket', example: 'Seat 1' })
  label: string;
}

class CouponDto {
  @ApiProperty({ description: 'Coupon code', example: 'DISCOUNT10' })
  code: string;
}

class OrderDto {
  @ApiProperty({ description: 'Unique identifier of the order', example: '1' })
  id: string;

  @ApiProperty({
    description: 'List of tickets associated with the order',
    type: [TicketDto],
  })
  ticket: TicketDto[];

  @ApiProperty({ description: 'Total price of the order', example: 100 })
  total_price: number;

  @ApiProperty({
    description: 'Coupon applied to the order',
    type: CouponDto,
    nullable: true,
  })
  coupon: CouponDto | null;
}

class PaginationDto {
  @ApiProperty({ description: 'Total number of orders', example: 100 })
  total: number;

  @ApiProperty({ description: 'Number of orders per page', example: 10 })
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
  @ApiProperty({ description: 'List of orders', type: [OrderDto] })
  items: OrderDto[];

  @ApiProperty({ description: 'Pagination details', type: PaginationDto })
  paginations: PaginationDto;
}

export class GetAllOrdersResponseDto {
  @ApiProperty({
    description: 'Response data containing items and paginations',
    type: DataDto,
  })
  data: DataDto;
}
