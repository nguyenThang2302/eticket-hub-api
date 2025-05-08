import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class TokenDto {
  @ApiProperty({
    description: 'Access token for authentication',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @Expose()
  access_token?: string;

  @ApiProperty({
    description: 'Expiration time of the access token',
    example: '2023-12-31T23:59:59Z',
  })
  @Expose()
  access_token_expire_time?: string;

  @ApiProperty({
    description: 'Refresh token for renewing access',
    example: 'dGhpc2lzYXJlZnJlc2h0b2tlbg==',
  })
  @Expose()
  refresh_token?: string;

  @ApiProperty({
    description: 'Expiration time of the refresh token',
    example: '2024-12-31T23:59:59Z',
  })
  @Expose()
  refresh_token_expire_time?: string;

  @ApiProperty({ description: 'Type of the token', example: 'Bearer' })
  @Expose()
  token_type?: string;
}
