import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
class Ticket {
  @Expose()
  name: string;

  @Expose()
  price: string;
}

@Exclude()
class Venue {
  @Expose()
  name: string;

  @Expose()
  address: string;
}

@Exclude()
class Organize {
  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  logo_url: string;
}

@Exclude()
export class EventDetailResponseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  start_time: string;

  @Expose()
  @Type(() => Venue)
  venue: Venue;

  @Expose()
  poster_url: string;

  @Expose()
  description: string;

  @Expose()
  price: string;

  @Expose()
  @Type(() => Ticket)
  tickets: Ticket[];

  @Expose()
  @Type(() => Organize)
  organize: Organize;
}
