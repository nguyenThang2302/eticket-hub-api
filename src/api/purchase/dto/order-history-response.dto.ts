import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class Pagination {
  @Expose()
  total: number;

  @Expose()
  page: number;

  @Expose()
  limit: number;

  @Expose()
  current_page: number;

  @Expose()
  total_page: number;

  @Expose()
  has_next_page: boolean;

  @Expose()
  has_previous_page: boolean;
}

@Exclude()
export class OrderHistoryResponseDto {
  @Expose()
  id: string;

  @Expose()
  payment_method: string;

  @Expose()
  total_price: number;

  @Expose()
  status: string;

  @Expose()
  created_at: string;

  @Expose()
  @Type(() => Pagination)
  pagination: Pagination;
}
