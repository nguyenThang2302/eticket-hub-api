import { ApiProperty } from '@nestjs/swagger';

class ApproveEventDto {
  @ApiProperty({
    description: 'The unique identifier of the event',
    example: '12345',
  })
  id: string;
}

export class ApproveEventResponseDto {
  @ApiProperty({
    description: 'The response data containing event details',
    type: ApproveEventDto,
  })
  data!: ApproveEventDto;
}
