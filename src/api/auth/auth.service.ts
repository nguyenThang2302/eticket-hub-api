import * as _ from 'lodash';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/login.dto';
import { TokenDto } from './dto/token.dto';
import { UserService } from '../user/user.service';
import { User } from '../../database/entities/user.entity';
import { BEARER, jwtConstants, PROVIDER, ROLE } from '../common/constants';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AccessToken, RefreshToken } from '../../database/entities';
import { CreateAuthDto } from './dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { SendVerificationEmailDto } from '../mail/mail.interface';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { JwtPayload } from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    @InjectRepository(AccessToken)
    private readonly accessTokenRepository: Repository<AccessToken>,
    @InjectQueue('emailSending') private readonly emailQueue: Queue,
  ) {}

  async hashPassword(password: string): Promise<string> {
    const saltOrRound = this.configService.get<number>('bcrypt.salt_or_round');

    const hash = await bcrypt.hash(password, saltOrRound);
    return hash;
  }

  async register(body: CreateAuthDto): Promise<any> {
    const { name: fullName, email, password, role } = body;

    const existingUser = await this.userService.findExistingEmail(email);
    if (existingUser) throw new BadRequestException('ALREADY_EXIST_EMAIL');

    const hashPassword = await this.hashPassword(password);

    const createUserDto: CreateUserDto = {
      name: fullName,
      email,
      password: hashPassword,
      role: ROLE[`${role}`],
    };

    const data = await this.userService.create(createUserDto);

    const payload = { type: jwtConstants.type.register, sub: data.id };
    const verifyToken = await this.jwtService.signAsync(payload, {
      expiresIn: jwtConstants.expires.register,
    });

    const contextMailVerification = this.configService.get<object>(
      'nestmailer.contextMailVerification',
    ) as { linkVerification?: string };

    const urlVerificationMail = this.configService.get<string>(
      'nestmailer.urlVerificationMail',
    );

    contextMailVerification.linkVerification = encodeURI(
      urlVerificationMail + `?token=${verifyToken}`,
    );

    const dtoSendVerificationEmail: SendVerificationEmailDto = {
      from: this.configService.get<object>('nestmailer.fromMailVerification'),
      recipients: [{ name: fullName, address: email }],
      subject: 'Verification Account Morent Website',
      context: contextMailVerification,
      template: 'send-verification-email',
    };

    await this.emailQueue.add('SendEmailVerication', dtoSendVerificationEmail);
  }

  async verifyTokenEmailRegister(token: string): Promise<unknown> {
    try {
      const payloadVerificationEmail = this.jwtService.verify(token);
      const typeToken: string = payloadVerificationEmail.type;

      if (typeToken !== jwtConstants.type.register) {
        throw new BadRequestException('INVALID_TYPE_TOKEN');
      }

      const userId = payloadVerificationEmail.sub;

      await this.userService.updateVerification(userId, true);
      return {
        message: 'Success',
      };
    } catch (error) {
      throw error;
    }
  }

  async login(body: LoginDto): Promise<TokenDto> {
    const user = await this.validateUser(body);

    if (!user.is_verified)
      throw new UnauthorizedException('EMAIL_NOT_VERIFIED');

    const { access_token_id, refresh_token_id } = await this.saveToken(user.id);

    const access_token = await this.generateAccessToken({
      sub: user.id,
      jti: access_token_id,
    });

    const refresh_token = await this.generateRefreshToken({
      sub: user.id,
      jti: refresh_token_id,
    });

    return {
      access_token: access_token,
      access_token_expire_time: this.configService.get<string>(
        'jwt.access_token_expire_time',
      ),
      refresh_token: refresh_token,
      refresh_token_expire_time: this.configService.get<string>(
        'jwt.refresh_token_expire_time',
      ),
      token_type: BEARER,
    };
  }

  async refresh(userId: string, refreshTokenId: string): Promise<TokenDto> {
    const accessToken = await this.accessTokenRepository
      .createQueryBuilder('access_token')
      .leftJoinAndSelect('access_token.refresh_token', 'refresh_token')
      .where('refresh_token.id = :id', { id: refreshTokenId })
      .getOne();

    if (accessToken)
      await this.accessTokenRepository.delete({ id: accessToken.id });

    const newAccessToken = this.accessTokenRepository.create({
      user: { id: userId },
      expired_at: new Date(
        Date.now() +
          this.configService.get<number>('jwt.access_token_expire_time') * 1000,
      ),
    });

    const saveNewAccessToken =
      await this.accessTokenRepository.save(newAccessToken);

    await this.refreshTokenRepository.update(refreshTokenId, {
      access_token: { id: saveNewAccessToken.id },
    });

    const generateNewAccessToken = await this.generateAccessToken({
      sub: userId,
      jti: saveNewAccessToken.id,
    });

    return {
      access_token: generateNewAccessToken,
      access_token_expire_time: this.configService.get<string>(
        'jwt.access_token_expire_time',
      ),
      token_type: BEARER,
    };
  }

  async logout(accessTokenId: string): Promise<void> {
    const [refreshToken] = await this.refreshTokenRepository.find({
      where: {
        access_token: { id: accessTokenId },
      },
      relations: ['access_token'],
    });

    await this.accessTokenRepository.delete(refreshToken.access_token.id);
    await this.refreshTokenRepository.delete(refreshToken.id);
  }
  private async validateUser(body: LoginDto): Promise<User> {
    const user = await this.userService.findExistingEmail(body.email);

    if (user && (await bcrypt.compare(body.password, user.password)))
      return user;

    throw new BadRequestException('INVALID_ACCOUNT');
  }

  private async generateAccessToken(payload: JwtPayload): Promise<string> {
    return await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('jwt.access_token_secret'),
      expiresIn: this.configService.get<string>('jwt.access_token_expire_time'),
    });
  }

  private async generateRefreshToken(payload: JwtPayload): Promise<string> {
    return await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('jwt.refresh_token_secret'),
      expiresIn: this.configService.get<string>(
        'jwt.refresh_token_expire_time',
      ),
    });
  }

  private async saveToken(
    userId: string,
  ): Promise<{ access_token_id: string; refresh_token_id: string }> {
    const accessToken = await this.accessTokenRepository.create({
      user: { id: userId },
      expired_at: new Date(
        Date.now() +
          this.configService.get<number>('jwt.access_token_expire_time') * 1000,
      ),
    });
    const access_token = await this.accessTokenRepository.save(accessToken);

    const refreshToken = await this.refreshTokenRepository.create({
      user: { id: userId },
      access_token: access_token,
      expired_at: new Date(
        Date.now() +
          this.configService.get<number>('jwt.refresh_token_expire_time') *
            1000,
      ),
    });

    const refresh_token = await this.refreshTokenRepository.save(refreshToken);

    return {
      access_token_id: _.get(access_token, 'id', ''),
      refresh_token_id: _.get(refresh_token, 'id', ''),
    };
  }

  async signInGoogle(user: any) {
    const { email } = user;
    const existingUser = await this.userService.findExistingEmail(email);
    if (existingUser && existingUser.provider !== PROVIDER.GOOGLE) {
      throw new BadRequestException('INVALID_USER_INFO');
    }
    if (existingUser && existingUser.provider === PROVIDER.GOOGLE) {
      const { access_token_id, refresh_token_id } = await this.saveToken(
        existingUser.id,
      );

      const access_token = await this.generateAccessToken({
        sub: existingUser.id,
        jti: access_token_id,
      });

      const refresh_token = await this.generateRefreshToken({
        sub: existingUser.id,
        jti: refresh_token_id,
      });

      return {
        access_token: access_token,
        access_token_expire_time: this.configService.get<string>(
          'jwt.access_token_expire_time',
        ),
        refresh_token: refresh_token,
        refresh_token_expire_time: this.configService.get<string>(
          'jwt.refresh_token_expire_time',
        ),
        token_type: BEARER,
      };
    }
    const data = await this.userService.createGoogleUser(user);
    if (data) {
      const { access_token_id, refresh_token_id } = await this.saveToken(
        data.id,
      );

      const access_token = await this.generateAccessToken({
        sub: data.id,
        jti: access_token_id,
      });

      const refresh_token = await this.generateRefreshToken({
        sub: data.id,
        jti: refresh_token_id,
      });

      return {
        access_token: access_token,
        access_token_expire_time: this.configService.get<string>(
          'jwt.access_token_expire_time',
        ),
        refresh_token: refresh_token,
        refresh_token_expire_time: this.configService.get<string>(
          'jwt.refresh_token_expire_time',
        ),
        token_type: BEARER,
      };
    }
  }
}
