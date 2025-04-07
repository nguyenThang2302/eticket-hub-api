import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSeatDto {
  @IsNotEmpty({ message: 'FIELD-0001' })
  @IsString({ message: 'FIELD-0002' })
  event_id: string;

  @IsNotEmpty({ message: 'FIELD-0001' })
  @IsString({ message: 'FIELD-0002' })
  name: string;

  @IsNotEmpty({ message: 'FIELD-0001' })
  @IsString({ message: 'FIELD-0002' })
  seat_map_data: string;
}
