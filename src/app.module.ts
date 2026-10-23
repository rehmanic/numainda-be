import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TelephonyModule } from './telephony/telephony.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TelephonyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
