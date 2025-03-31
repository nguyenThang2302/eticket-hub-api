import { IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: 'FIELD-0001' })
  email: string;

  @IsNotEmpty({ message: 'FIELD-0001' })
  password: string;
}
