import { Exclude, Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
class Ticket {
  @ApiProperty({ description: 'Name of the ticket', example: 'VIP Ticket' })
  @Expose()
  name: string;

  @ApiProperty({ description: 'Price of the ticket', example: '100.00' })
  @Expose()
  price: string;
}

@Exclude()
class Venue {
  @ApiProperty({
    description: 'Name of the venue',
    example: 'Madison Square Garden',
  })
  @Expose()
  name: string;

  @ApiProperty({ description: 'Address of the venue', example: 'New York, NY' })
  @Expose()
  address: string;
}

@Exclude()
class Organize {
  @ApiProperty({
    description: 'ID of the organizer',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  id: string;

  @ApiProperty({ description: 'Name of the organizer', example: 'Event Corp' })
  @Expose()
  name: string;

  @ApiProperty({
    description: 'Description of the organizer',
    example: 'Leading event organizer',
  })
  @Expose()
  description: string;

  @ApiProperty({
    description: 'Logo URL of the organizer',
    example: 'https://example.com/logo.png',
  })
  @Expose()
  logo_url: string;
}

@Exclude()
export class EventDetailResponseDto {
  @ApiProperty({
    description: 'ID of the event',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Name of the event',
    example: 'Music Festival 2023',
  })
  @Expose()
  name: string;

  @ApiProperty({
    description: 'Start time of the event',
    example: '2023-11-01T18:00:00Z',
  })
  @Expose()
  start_time: string;

  @ApiProperty({
    description: 'End time of the event',
    example: '2023-11-01T23:00:00Z',
  })
  @Expose()
  end_time: string;

  @ApiProperty({ description: 'Venue details of the event', type: Venue })
  @Expose()
  @Type(() => Venue)
  venue: Venue;

  @ApiProperty({
    description: 'Poster URL of the event',
    example: 'https://example.com/poster.png',
  })
  @Expose()
  poster_url: string;

  @ApiProperty({
    description: 'Description of the event',
    example: 'A grand music festival featuring top artists.',
  })
  @Expose()
  description: string;

  @ApiProperty({ description: 'Price of the event', example: '50.00' })
  @Expose()
  price: string;

  @ApiProperty({
    description: 'List of tickets available for the event',
    type: [Ticket],
  })
  @Expose()
  @Type(() => Ticket)
  tickets: Ticket[];

  @ApiProperty({
    description: 'Organizer details of the event',
    type: Organize,
  })
  @Expose()
  @Type(() => Organize)
  organize: Organize;
}
