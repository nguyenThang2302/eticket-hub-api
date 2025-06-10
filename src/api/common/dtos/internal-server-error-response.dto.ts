import { ApiProperty } from '@nestjs/swagger';

export class InternalServerErrorResponseDto {
  @ApiProperty({ type: String, example: 'システムエラー' })
  title?: string;

  @ApiProperty({ type: String, example: 'US-0500' })
  error_id?: string;

  @ApiProperty({ type: String, example: 'INTERNAL_ERROR' })
  code?: string;

  @ApiProperty({
    type: String,
    example: '内部サーバーエラーが発生しました。問題が解決しない場合はお問い合わせください。',
  })
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
