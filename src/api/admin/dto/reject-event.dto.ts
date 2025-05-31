import { ApiProperty } from '@nestjs/swagger';

class RejectEventDto {
  @ApiProperty({
    description: 'The unique identifier of the event',
    example: '12345',
  })
  id: string;
}

export class RejectEventResponseDto {
  @ApiProperty({
    description: 'The response data containing event details',
    type: RejectEventDto,
  })
  data!: RejectEventDto;
}
