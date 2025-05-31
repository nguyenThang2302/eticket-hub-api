import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationRequestDto {
  @ApiPropertyOptional({
    description: 'Limit for pagination',
    example: 20,
    default: 10,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Limit must be a valid number' })
  @Min(1, { message: 'Limit must be at least 1' })
  limit = 10;

  @ApiPropertyOptional({
    description: 'Offset for pagination',
    example: 0,
    default: 0,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Offset must be a valid number' })
  @Min(0, { message: 'Offset must be at least 0' })
  offset = 0;
}
