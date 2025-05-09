import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ROLE } from 'src/api/common/constants';
import { IsValidPassword } from 'src/api/utils/helpers';

export class CreateAuthDto {
  @ApiProperty({
    description: 'Email address of the user',
    example: 'user@example.com',
  })
  @IsNotEmpty({ message: 'FIELD_REQUIRED' })
  @IsEmail({}, { message: 'INVALID_EMAIL' })
  email: string;

  @ApiProperty({ description: 'Password of the user', example: 'P@ssw0rd!' })
  @IsNotEmpty({ message: 'FIELD_REQUIRED' })
  @IsString({ message: 'FIELD-0002' })
  @IsValidPassword()
  password: string;

  @ApiProperty({ description: 'Full name of the user', example: 'John Doe' })
  @IsNotEmpty({ message: 'FIELD_REQUIRED' })
  @IsString({ message: 'FIELD-0002' })
  name: string;

  @ApiProperty({
    description: 'Role of the user',
    enum: ROLE,
    example: ROLE.USER,
  })
  @IsNotEmpty({ message: 'FIELD_REQUIRED' })
  @IsString({ message: 'FIELD-0002' })
  role: ROLE;
}
