import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AppointmentModule } from './appointment/appointment.module';
import { PrismaModule } from 'prisma/prisma.module';
import { ServiceModule } from './service/service.module';

@Module({
  imports: [AuthModule, UserModule, AppointmentModule, PrismaModule, ServiceModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
