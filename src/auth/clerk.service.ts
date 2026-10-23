import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClerkClient } from '@clerk/backend';

@Injectable()
export class ClerkService {
  private readonly logger = new Logger(ClerkService.name);
  public readonly client: ReturnType<typeof createClerkClient>;

  constructor(private readonly configService: ConfigService) {
    const secretKey = this.configService.get<string>('CLERK_SECRET_KEY');
    this.client = createClerkClient({ secretKey });
  }

  async getUser(userId: string) {
    return this.client.users.getUser(userId);
  }
}
