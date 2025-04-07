import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class ListPaymentMethodResponseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  logo_url: string;
}

@Exclude()
export class ListPaymentMethodResponseWrapperDto {
  @Expose()
  @Type(() => ListPaymentMethodResponseDto)
  items: ListPaymentMethodResponseDto[];
}
