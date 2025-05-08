import { Exclude, Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class ListCategoryResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the category',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  id: string;

  @ApiProperty({ description: 'Name of the category', example: 'Electronics' })
  @Expose()
  name: string;
}

@Exclude()
export class ListCategoryResponseWrapperDto {
  @ApiProperty({
    description: 'Array of category items',
    type: [ListCategoryResponseDto],
  })
  @Expose()
  @Type(() => ListCategoryResponseDto)
  items: ListCategoryResponseDto[];
}
