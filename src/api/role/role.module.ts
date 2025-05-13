import { Module } from '@nestjs/common';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/database/entities';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [RoleController],
  providers: [RoleService],
})
export class RoleModule {}
