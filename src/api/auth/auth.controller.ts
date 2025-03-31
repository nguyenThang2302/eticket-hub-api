import {
  Controller,
  Post,
  Body,
  HttpCode,
  Get,
  Query,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginDto } from './dto/login.dto';
import { TokenDto } from './dto/token.dto';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard, RefreshGuard } from '../common/guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtPayload } from 'jsonwebtoken';
import { GoogleOauthGuard } from '../common/guard/google-oauth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('/register')
  async registerUser(@Body() createAuthDto: CreateAuthDto) {
    await this.authService.register(createAuthDto);
  }

  @HttpCode(HttpStatus.OK)
  @Get('/verify-email')
  async verificationEmailRegister(@Query() params: any) {
    const tokenRegister: string = params.token;
    return await this.authService.verifyTokenEmailRegister(tokenRegister);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() body: LoginDto): Promise<TokenDto> {
    return plainToInstance(TokenDto, await this.authService.login(body));
  }

  @UseGuards(RefreshGuard)
  @HttpCode(HttpStatus.OK)
  @Post('refresh-token')
  async refreshToken(@CurrentUser() user: JwtPayload): Promise<TokenDto> {
    return plainToInstance(
      TokenDto,
      await this.authService.refresh(user.sub, user.jti),
    );
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('logout')
  logout(@CurrentUser() user: JwtPayload): void {
    this.authService.logout(user.jti);
  }

  @Get('google')
  @UseGuards(GoogleOauthGuard)
  async googleLogin() {}

  @Get('google/callback')
  @HttpCode(HttpStatus.OK)
  @UseGuards(GoogleOauthGuard)
  async googleAuthCallback(@Req() req) {
    return await this.authService.signInGoogle(req.user);
  }
}
