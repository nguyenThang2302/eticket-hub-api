import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class ListCategoryResponseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;
}

@Exclude()
export class ListCategoryResponseWrapperDto {
  @Expose()
  @Type(() => ListCategoryResponseDto)
  items: ListCategoryResponseDto[];
}
