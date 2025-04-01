import { IsNotEmpty, IsString } from 'class-validator';

export class CreateOrganizeDto {
  @IsNotEmpty({ message: 'FIELD-0001' })
  @IsString({ message: 'FIELD-0002' })
  name: string;

  @IsNotEmpty({ message: 'FIELD-0001' })
  @IsString({ message: 'FIELD-0002' })
  description: string;
}
