import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class BaseDataResponseDto<T> {
  @ApiProperty()
  @Expose()
  @Type(() => Object)
  data!: T;
}
