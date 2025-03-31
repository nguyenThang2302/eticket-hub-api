import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { IsValidPassword } from 'src/api/utils/helpers';

export class CreateAuthDto {
  @IsNotEmpty({ message: 'FIELD-0001' })
  @IsEmail({}, { message: 'FIELD-0003' })
  email: string;

  @IsNotEmpty({ message: 'FIELD-0001' })
  @IsString({ message: 'FIELD-0002' })
  @IsValidPassword()
  password: string;

  @IsNotEmpty({ message: 'FIELD-0001' })
  @IsString({ message: 'FIELD-0002' })
  name: string;
}
