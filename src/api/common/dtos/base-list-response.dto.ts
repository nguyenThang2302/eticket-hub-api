import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

class PaginationResponseDto {
  @ApiProperty({ example: 100 })
  @Expose()
  total!: number;

  @ApiProperty({ example: 0 })
  @Expose()
  offset!: number;

  @ApiProperty({ example: 10 })
  @Expose()
  limit!: number;
}

class LinkResponseDto {
  @ApiProperty({ example: 'https://example.com/api/v1/resource' })
  @Expose()
  self!: string;

  @ApiProperty({ example: 'https://example.com/api/v1/resource?page=1' })
  @Expose()
  last!: string;
}

export class BaseListItemsResponse<T> {
  @ApiProperty({ isArray: true })
  @Expose()
  items!: T[];

  @ApiProperty({ type: PaginationResponseDto })
  @Expose()
  pagination!: PaginationResponseDto;

  @ApiProperty({ type: LinkResponseDto })
  @Expose()
  link!: LinkResponseDto;
}

export class BaseListResponseDto<T> {
  @ApiProperty({ type: BaseListItemsResponse })
  @Expose()
  data!: BaseListItemsResponse<T>;
}
