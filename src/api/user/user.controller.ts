import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtPayload } from 'jsonwebtoken';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { plainToInstance } from 'class-transformer';
import { UserResponeDto } from '../auth/dto';
import { JwtAuthGuard } from '../common/guard';
import { UserService } from './user.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateProfileInformationDto } from './dto/update-profile-information.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get('me')
  async getCurrentUser(
    @CurrentUser() user: JwtPayload,
  ): Promise<UserResponeDto> {
    return plainToInstance(
      UserResponeDto,
      await this.userService.getCurrentUser(user.sub),
    );
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Put('change-passwords')
  async changePassword(
    @Body() body: ChangePasswordDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return await this.userService.changePassword(user.sub, body);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Put('change-profile-infos')
  async updateUserInfo(
    @Body() body: UpdateProfileInformationDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return await this.userService.updateUserInfo(user.sub, body);
  }
}
