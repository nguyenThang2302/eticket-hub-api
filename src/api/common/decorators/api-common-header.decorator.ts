import { applyDecorators } from '@nestjs/common';
import { ApiHeader } from '@nestjs/swagger';

export function ApiCommonHeaders() {
  return applyDecorators(
    ApiHeader({
      name: 'x-api-organize-id',
      description:
        'Identifier representing the promoter or workspace for API requests',
      required: true,
    }),
  );
}
