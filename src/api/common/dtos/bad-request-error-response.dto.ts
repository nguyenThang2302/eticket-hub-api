import { ApiProperty } from '@nestjs/swagger';

export class BadRequestErrorResponseDto {
  @ApiProperty({ type: String })
  title?: string;

  @ApiProperty({ type: String })
  error_id?: string;

  @ApiProperty({ type: String })
  code?: string;

  @ApiProperty({ type: String })
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
  errors?: {
    error_id: string;
    field: string;
    message: string;
  }[];
}
