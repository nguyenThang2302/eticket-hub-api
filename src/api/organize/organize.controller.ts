import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { CreateOrganizeDto } from './dto/create-organize.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { ROLE } from '../common/constants';
import { JwtAuthGuard, RolesGuard } from '../common/guard';
import { OrganizeService } from './organize.service';

@Controller('organizes')
export class OrganizeController {
  constructor(private readonly organizeService: OrganizeService) {}

  @Roles(ROLE.PROMOTER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async registerOrganization(
    @Req() req: Request,
    @Body() body: CreateOrganizeDto,
  ): Promise<any> {
    const promoterId = req.user['sub'];
    const languageCode = req.headers['accept-language'];
    return this.organizeService.registerOrganization(
      promoterId,
      languageCode,
      body,
    );
  }
}
