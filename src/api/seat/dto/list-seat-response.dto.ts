import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class ListSeatResponseDto {
  @Expose()
  id: string;

  @Expose()
  row: string;

  @Expose()
  label: string;

  @Expose()
  type: string;
}

@Exclude()
export class ListSeatResponseWrapperDto {
  @Expose()
  @Type(() => ListSeatResponseDto)
  items: ListSeatResponseDto[];
}
