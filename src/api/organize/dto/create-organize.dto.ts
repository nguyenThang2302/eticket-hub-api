import { IsNotEmpty, IsString } from 'class-validator';

export class CreateOrganizeDto {
  @IsNotEmpty({ message: 'FIELD_REQUIRED' })
  @IsString({ message: 'FIELD-0002' })
  name: string;

  @IsNotEmpty({ message: 'FIELD_REQUIRED' })
  @IsString({ message: 'FIELD-0002' })
  description: string;
}
