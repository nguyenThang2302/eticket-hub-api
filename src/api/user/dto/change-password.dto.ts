import { IsString } from 'class-validator';

export class ChangePasswordDto {
  @IsString({ message: 'ERR-0002' })
  current_password: string;

  @IsString({ message: 'ERR-0002' })
  new_password: string;

  @IsString({ message: 'ERR-0002' })
  confirm_new_password: string;
}
