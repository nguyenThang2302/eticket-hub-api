import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { IsEmailExistedConstraint } from './common/decorators/is-email-existed';
import { MediaModule } from './media/media.module';
import { CloudinaryModule } from './media/cloudinary/cloudinary.module';
import { ChatModule } from './chat/chat.module';
import { NotificationModule } from './notification/notification.module';
import { OrganizeModule } from './organize/organize.module';
import { EventModule } from './event/event.module';
import { CategoryModule } from './category/category.module';
import { SeatModule } from './seat/seat.module';
import { PaymentMethodModule } from './payment-method/payment-method.module';
import { PurchaseModule } from './purchase/purchase.module';
import { CouponModule } from './coupon/coupon.module';
import { TicketModule } from './ticket/ticket.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    MediaModule,
    CloudinaryModule,
    ChatModule,
    NotificationModule,
    OrganizeModule,
    EventModule,
    CategoryModule,
    SeatModule,
    PaymentMethodModule,
    PurchaseModule,
    CouponModule,
    TicketModule,
  ],
  providers: [
    IsEmailExistedConstraint,
    { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
  ],
})
export class ApiModule {}
