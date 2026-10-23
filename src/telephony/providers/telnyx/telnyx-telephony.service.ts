import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ITelephonyService, TelephonyToken } from '../../interfaces/telephony-service.interface';

@Injectable()
export class TelnyxTelephonyService implements ITelephonyService {
  private readonly logger = new Logger(TelnyxTelephonyService.name);
  private readonly apiKey: string;
  private readonly credentialId: string;
  private readonly callerId: string;

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.getOrThrow<string>('TELNYX_API_KEY');
    this.credentialId = this.configService.getOrThrow<string>('TELNYX_CREDENTIAL_ID');
    this.callerId = this.configService.getOrThrow<string>('TELNYX_CALLER_ID');
  }

  async getCallerId(): Promise<string> {
    return this.callerId;
  }

  async getClientToken(_userId?: string): Promise<TelephonyToken> {
    const url = `https://api.telnyx.com/v2/telephony_credentials/${this.credentialId}/token`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        this.logger.error(`Failed to generate Telnyx client token: ${response.status} ${errorText}`);
        throw new Error(`Telnyx token generation failed with status ${response.status}`);
      }

      // The endpoint returns the JWT directly as text or as a JSON string/object
      const rawBody = await response.text();
      let token: string;
      try {
        const parsed = JSON.parse(rawBody);
        token = typeof parsed === 'string' ? parsed : parsed.token || parsed.data || rawBody;
      } catch {
        token = rawBody;
      }

      return {
        provider: 'telnyx',
        token: token.trim().replace(/^"|"$/g, ''),
        callerId: this.callerId,
        expiresIn: 86400, // 24 hours
      };
    } catch (error) {
      this.logger.error(`Error requesting token from Telnyx API`, error);
      throw error;
    }
  }

  async handleWebhook(payload: unknown, headers?: Record<string, string>): Promise<void> {
    this.logger.log(`Received Telnyx webhook event`, { payload, headers });
    // Handle call events if required (e.g. logging, analytics)
  }
}
