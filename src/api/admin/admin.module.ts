import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from 'src/database/entities/event.entity';
import { User } from 'src/database/entities';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Event, User]), UserModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
