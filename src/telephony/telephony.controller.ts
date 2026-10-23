import { Controller, Get, Post, Body, Headers, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TELEPHONY_SERVICE } from './interfaces/telephony-service.interface';
import type { ITelephonyService, TelephonyToken } from './interfaces/telephony-service.interface';

@ApiTags('telephony')
@Controller('telephony')
export class TelephonyController {
  constructor(
    @Inject(TELEPHONY_SERVICE)
    private readonly telephonyService: ITelephonyService,
  ) {}

  @Get('token')
  @ApiOperation({ summary: 'Generate WebRTC client login token for softphone' })
  @ApiResponse({ status: 200, description: 'JWT token and caller ID' })
  async getToken(): Promise<TelephonyToken> {
    return this.telephonyService.getClientToken();
  }

  @Post('webhooks')
  @ApiOperation({ summary: 'Ingest telephony provider webhooks' })
  async handleWebhook(
    @Body() payload: unknown,
    @Headers() headers: Record<string, string>,
  ): Promise<{ received: boolean }> {
    await this.telephonyService.handleWebhook(payload, headers);
    return { received: true };
  }
}
