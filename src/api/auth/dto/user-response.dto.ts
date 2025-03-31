import { Exclude, Expose } from 'class-transformer';
import { ROLE } from 'src/api/common/constants';

@Exclude()
export class UserResponeDto {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  name: string;

  @Expose()
  role: ROLE;

  @Expose()
  avatar_url: string;
}
