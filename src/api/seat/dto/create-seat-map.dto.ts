import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSeatMapDto {
  @IsNotEmpty()
  @IsString()
  data: string;
}
