import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { JwtAuthGuard } from '../common/guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get('check')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async checkRole(@CurrentUser() user: any): Promise<any> {
    const userId = user['sub'];
    return this.roleService.getRoles(userId);
  }
}
