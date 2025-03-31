import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { IsEmailExistedConstraint } from './common/decorators/is-email-existed';
import { MediaModule } from './media/media.module';
import { CloudinaryModule } from './media/cloudinary/cloudinary.module';

@Module({
  imports: [AuthModule, UserModule, MediaModule, CloudinaryModule],
  controllers: [],
  providers: [
    IsEmailExistedConstraint,
    { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
  ],
})
export class ApiModule {}
