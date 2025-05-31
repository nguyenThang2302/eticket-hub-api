import { ApiProperty } from '@nestjs/swagger';

class VenueDto {
  @ApiProperty({ description: 'Name of the venue', example: 'Grand Hall' })
  name: string;

  @ApiProperty({
    description: 'Address of the venue',
    example: '123 Main St, City, Country',
  })
  address: string;
}

class EventDto {
  @ApiProperty({ description: 'Unique identifier of the event', example: '1' })
  id: string;

  @ApiProperty({ description: 'Name of the event', example: 'Music Concert' })
  name: string;

  @ApiProperty({ description: 'Status of the event', example: 'ACTIVE' })
  status: string;

  @ApiProperty({
    description: 'Start time of the event',
    example: '2023-10-01T18:00:00Z',
  })
  start_time: Date;

  @ApiProperty({
    description: 'End time of the event',
    example: '2023-10-01T21:00:00Z',
  })
  end_time: Date;

  @ApiProperty({
    description: 'URL of the event poster',
    example: 'https://example.com/poster.jpg',
  })
  poster_url: string;

  @ApiProperty({ description: 'Venue details of the event', type: VenueDto })
  venue: VenueDto;
}

class PaginationDto {
  @ApiProperty({ description: 'Total number of events', example: 100 })
  total: number;

  @ApiProperty({ description: 'Number of events per page', example: 10 })
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
  @ApiProperty({ description: 'List of events', type: [EventDto] })
  items: EventDto[];

  @ApiProperty({ description: 'Pagination details', type: PaginationDto })
  paginations: PaginationDto;
}

export class GetAllEventsResponseDto {
  @ApiProperty({
    description: 'Response data containing items and paginations',
    type: DataDto,
  })
  data: DataDto;
}
