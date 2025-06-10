import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class PaginationDto {
  @ApiProperty({ description: 'Total number of items', example: 22 })
  @Expose()
  total?: number;

  @ApiProperty({ description: 'Number of items per page', example: 10 })
  @Expose()
  limit?: number;

  @ApiProperty({ description: 'Offset of the current page', example: 20 })
  @Expose()
  offset?: number;
}

export class LinkDto {
  @ApiProperty({
    description: 'Link to the current page',
    example: 'https://api.sample/v1.0/singer?limit=10&offset=20',
  })
  @Expose()
  self?: string;

  @ApiProperty({ description: 'Link to the next page', example: null })
  @Expose()
  next?: string | null;

  @ApiProperty({ description: 'Link to the last page', example: 'https://api.sample/v1.0/singer?limit=10&offset=20' })
  @Expose()
  last?: string | null;
}
