import { ApiProperty } from '@nestjs/swagger';

class OrganizerDto {
  @ApiProperty({
    description: 'Unique identifier of the organizer',
    example: '1',
  })
  id: string;

  @ApiProperty({
    description: 'Name of the organizer',
    example: 'Event Organizer Inc.',
  })
  name: string;

  @ApiProperty({
    description: 'Description of the organizer',
    example: 'Leading event organizer in the region.',
  })
  description: string;

  @ApiProperty({
    description: 'URL of the organizer logo',
    example: 'https://example.com/logo.png',
  })
  logo_url: string;

  @ApiProperty({
    description: 'Indicates if the organizer is active',
    example: true,
  })
  is_active: boolean;

  @ApiProperty({ description: 'Status of the organizer', example: 'ACTIVE' })
  status: string;

  @ApiProperty({
    description: 'Date when the organizer was created',
    example: '2023-01-01T00:00:00Z',
  })
  created_at: Date;
}

class PaginationDto {
  @ApiProperty({ description: 'Total number of organizers', example: 100 })
  total: number;

  @ApiProperty({ description: 'Number of organizers per page', example: 10 })
  limit: number;

  @ApiProperty({ description: 'Current page number', example: 1 })
  page: number;

  @ApiProperty({ description: 'Current page number', example: 1 })
  current_page: number;

  @ApiProperty({ description: 'Total number of pages', example: 10 })
  total_page: number;

  @ApiProperty({
    description: 'Indicates if there is a next page',
    example: true,
  })
  has_next_page: boolean;

  @ApiProperty({
    description: 'Indicates if there is a previous page',
    example: false,
  })
  has_previous_page: boolean;

  @ApiProperty({ description: 'Next page number, if available', example: 2 })
  next_page: number | null;
}

class DataDto {
  @ApiProperty({ description: 'List of organizers', type: [OrganizerDto] })
  items: OrganizerDto[];

  @ApiProperty({ description: 'Pagination details', type: PaginationDto })
  paginations: PaginationDto;
}

export class GetAllOrganizersResponseDto {
  @ApiProperty({
    description: 'Response data containing items and paginations',
    type: DataDto,
  })
  data: DataDto;
}
