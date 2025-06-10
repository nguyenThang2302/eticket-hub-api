import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';

import { UnauthorizedErrorResponseDto } from '../dtos/unauthorized-error-response.dto';
import { ValidationErrorResponseDto } from '../dtos/validation-error-response.dto';
import { BadRequestErrorResponseDto } from '../dtos/bad-request-error-response.dto';
import { InternalServerErrorResponseDto } from '../dtos/internal-server-error-response.dto';

export function ApiCommonResponses() {
  return applyDecorators(
    ApiUnauthorizedResponse({ type: UnauthorizedErrorResponseDto }),
    ApiUnprocessableEntityResponse({ type: ValidationErrorResponseDto }),
    ApiBadRequestResponse({ type: BadRequestErrorResponseDto }),
    ApiInternalServerErrorResponse({ type: InternalServerErrorResponseDto }),
  );
}

export function ApiCustomResponse(statuses: number[]) {
  const decorators = statuses
    .map((status) => {
      switch (status) {
        case 400:
          return ApiBadRequestResponse({ type: BadRequestErrorResponseDto });
        case 404:
          return ApiNotFoundResponse();
        case 401:
          return ApiUnauthorizedResponse({
            type: UnauthorizedErrorResponseDto,
          });
        case 422:
          return ApiUnprocessableEntityResponse({
            type: ValidationErrorResponseDto,
          });
        case 500:
          return ApiInternalServerErrorResponse({
            type: InternalServerErrorResponseDto,
          });
        default:
          return null;
      }
    })
    .filter((decorator) => decorator !== null);

  return applyDecorators(...decorators);
}
