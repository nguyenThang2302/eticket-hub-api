import { Module } from '@nestjs/common';
import { OrganizeController } from './organize.controller';
import { OrganizeService } from './organize.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from 'src/database/entities/organization.entity';
import { Group } from 'src/database/entities/group.entity';
import { UserModule } from '../user/user.module';
import { Event } from 'src/database/entities/event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Organization, Group, Event]), UserModule],
  controllers: [OrganizeController],
  providers: [OrganizeService],
  exports: [OrganizeService],
})
export class OrganizeModule {}
