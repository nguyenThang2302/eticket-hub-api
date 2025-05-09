import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'Email address of the user',
    example: 'user@example.com',
  })
  @IsNotEmpty({ message: 'FIELD_REQUIRED' })
  email: string;

  @ApiProperty({ description: 'Password of the user', example: 'P@ssw0rd!' })
  @IsNotEmpty({ message: 'FIELD_REQUIRED' })
  password: string;
}
