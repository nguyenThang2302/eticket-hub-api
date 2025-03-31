import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class TokenDto {
  @Expose()
  access_token?: string;

  @Expose()
  access_token_expire_time?: string;

  @Expose()
  refresh_token?: string;

  @Expose()
  refresh_token_expire_time?: string;

  @Expose()
  token_type?: string;
}
