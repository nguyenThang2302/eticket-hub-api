import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '../../database/entities/user.entity';
import { PROVIDER, ROLE } from '../common/constants';
import { ChangePasswordDto } from './dto/change-password.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async getCurrentUser(userId: string): Promise<User> {
    const user = await this.findUserById(userId);

    if (!user) throw new UnauthorizedException('AUTH-0504');

    if (user.is_verified === false)
      throw new UnauthorizedException('AUTH-0503');

    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create({
      name: createUserDto.name,
      email: createUserDto.email,
      password: createUserDto.password,
      avatar_url: process.env.AVATAR_URL_DEFAULT,
      role: createUserDto.role as ROLE,
    });

    return await this.usersRepository.save(user);
  }

  async createGoogleUser(userGoogleInfos: any): Promise<User> {
    const user = this.usersRepository.create({
      name: userGoogleInfos.name,
      email: userGoogleInfos.email,
      password: null,
      avatar_url: userGoogleInfos.picture,
      provider: PROVIDER.GOOGLE,
    });

    return await this.usersRepository.save(user);
  }

  async findExistingEmail(email: string): Promise<User> {
    return await this.usersRepository.findOneBy({ email });
  }

  async updateAvatarUrl(id: string, avatarUrl: string): Promise<void> {
    await this.usersRepository.update(id, { avatar_url: avatarUrl });
  }

  async findUserById(id: string): Promise<User> {
    return await this.usersRepository.findOneBy({ id });
  }

  async updateVerification(id: string, is_verified: boolean) {
    return await this.usersRepository.update(id, { is_verified: is_verified });
  }

  async changePassword(userId: string, body: ChangePasswordDto) {
    const { current_password, new_password, confirm_new_password } = body;

    if (new_password !== confirm_new_password) {
      throw new BadRequestException(
        'New password and confirm password do not match',
      );
    }

    const user = await this.findUserById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(
      current_password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(new_password, 10);
    user.password = hashedPassword;
    await this.usersRepository.save(user);
    return {
      message: 'Success',
    };
  }

  async updateUserInfo(id: string, body: any) {
    try {
      await this.usersRepository.update(id, body);
    } catch (error) {
      console.log(error);
    }
    return {
      message: 'Success',
    };
  }
}
