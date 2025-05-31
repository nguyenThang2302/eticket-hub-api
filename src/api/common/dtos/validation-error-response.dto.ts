import { ApiProperty } from '@nestjs/swagger';

export class ValidationErrorResponseDto {
  @ApiProperty({ type: String, example: 'Validation Error' })
  title?: string;
  @ApiProperty({ type: String, example: 'US-0606' })
  error_id?: string;
  @ApiProperty({ type: String, example: 'VALIDATION_ERROR' })
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
        error_id: { type: 'string', example: 'US-0501' },
        field: { type: 'string', example: 'email' },
        message: { type: 'string', example: 'メールアドレスの形式が正しくありません。' },
      },
    },
  })
  errors?: [];
}
