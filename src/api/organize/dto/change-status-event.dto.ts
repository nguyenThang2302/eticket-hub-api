import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { EVENT_STATUS } from 'src/api/common/constants';

export class ChangeEventStatusDto {
  @IsNotEmpty({ message: 'FIELD_REQUIRED' })
  @IsString({ message: 'FIELD-0002' })
  @IsEnum(EVENT_STATUS)
  status: string;
}
