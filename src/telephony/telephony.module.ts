import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TelephonyController } from './telephony.controller';
import { TELEPHONY_SERVICE } from './interfaces/telephony-service.interface';
import { TelnyxTelephonyService } from './providers/telnyx/telnyx-telephony.service';

@Module({
  controllers: [TelephonyController],
  providers: [
    TelnyxTelephonyService,
    {
      provide: TELEPHONY_SERVICE,
      useFactory: (configService: ConfigService, telnyxService: TelnyxTelephonyService) => {
        const provider = configService.get<string>('TELEPHONY_PROVIDER', 'telnyx').toLowerCase();
        if (provider === 'telnyx') {
          return telnyxService;
        }
        throw new Error(`Unsupported telephony provider: ${provider}`);
      },
      inject: [ConfigService, TelnyxTelephonyService],
    },
  ],
  exports: [TELEPHONY_SERVICE],
})
export class TelephonyModule { }
