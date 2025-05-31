import { ApiProperty } from '@nestjs/swagger';

export class UnauthorizedErrorResponseDto {
  @ApiProperty({ type: String, example: 'ユーザー未認証' })
  title?: string;
  @ApiProperty({ type: String, example: 'US-0403' })
  error_id?: string;
  @ApiProperty({ type: String, example: 'UNAUTHORIZED_ACCESS' })
  code?: string;
  @ApiProperty({ type: String, example: 'ユーザー認証がされていません。もう一度ログインする必要があります。' })
  message?: string;
  @ApiProperty({
    type: 'array',
    items: {
      type: 'object',
      properties: {
        error_id: { type: 'string' },
        field: { type: 'string' },
        message: { type: 'string' },
      },
    },
  })
  errors?: [];
}
