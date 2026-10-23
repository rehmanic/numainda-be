import { Module, Global } from '@nestjs/common';
import { ClerkAuthGuard } from './clerk-auth.guard';
import { ClerkService } from './clerk.service';

@Global()
@Module({
  providers: [ClerkAuthGuard, ClerkService],
  exports: [ClerkAuthGuard, ClerkService],
})
export class AuthModule {}
