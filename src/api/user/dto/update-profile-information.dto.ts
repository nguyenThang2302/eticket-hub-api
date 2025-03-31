import { IsString, IsOptional } from 'class-validator';

export class UpdateProfileInformationDto {
  @IsString({ message: 'ERR-0002' })
  name: string;

  @IsOptional()
  @IsString({ message: 'ERR-0002' })
  sex: string;

  @IsOptional()
  @IsString({ message: 'ERR-0002' })
  date_of_birth: string;

  @IsOptional()
  @IsString({ message: 'ERR-0002' })
  phone_number: string;
}
