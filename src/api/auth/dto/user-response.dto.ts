import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ROLE } from 'src/api/common/constants';

@Exclude()
export class UserResponeDto {
  @ApiProperty({
    description: 'Unique identifier of the user',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Email address of the user',
    example: 'user@example.com',
  })
  @Expose()
  email: string;

  @ApiProperty({ description: 'Full name of the user', example: 'John Doe' })
  @Expose()
  name: string;

  @ApiProperty({
    description: 'Role of the user',
    enum: ROLE,
    example: ROLE.USER,
  })
  @Expose()
  role: ROLE;

  @ApiProperty({
    description: 'URL of the user avatar',
    example: 'https://example.com/avatar.jpg',
  })
  @Expose()
  avatar_url: string;

  @ApiProperty({
    description: 'Date of birth of the user',
    example: '1990-01-01',
  })
  @Expose()
  date_of_birth: Date;

  @ApiProperty({
    description: 'Phone number of the user',
    example: '+1234567890',
  })
  @Expose()
  phone_number: string;

  @ApiProperty({ description: 'Sex of the user', example: 'Male' })
  @Expose()
  sex: string;
}
