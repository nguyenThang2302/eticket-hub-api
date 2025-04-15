import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
class CouponDto {
  @Expose()
  code: string;

  @Expose()
  percent: number;
}

@Exclude()
class ReceiveInfosDto {
  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  phone_number: string;
}

@Exclude()
class VenueDto {
  @Expose()
  name: string;

  @Expose()
  address: string;
}

@Exclude()
class EventDto {
  @Expose()
  name: string;

  @Expose()
  start_time: string;

  @Expose()
  @Type(() => VenueDto)
  venue: VenueDto;
}

@Exclude()
class SeatInfoDto {
  @Expose()
  location: string;

  @Expose()
  ticket_name: string;

  @Expose()
  ticket_price: string;

  @Expose()
  ticket_url: string;

  @Expose()
  ticket_code: string;
}

@Exclude()
export class GetOrderDetailResponseDto {
  @Expose()
  id: string;

  @Expose()
  tracking_user: string;

  @Expose()
  payment_method_name: string;

  @Expose()
  @Type(() => CouponDto)
  coupon: CouponDto;

  @Expose()
  @Type(() => ReceiveInfosDto)
  receive_infos: ReceiveInfosDto;

  @Expose()
  discount_price: number;

  @Expose()
  sub_total_price: number;

  @Expose()
  total_price: number;

  @Expose()
  @Type(() => EventDto)
  event: EventDto;

  @Expose()
  @Type(() => SeatInfoDto)
  seat_info: SeatInfoDto[];

  @Expose()
  status: string;

  @Expose()
  created_at: string;
}
