import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface ClerkUser {
  userId: string;
  sessionId: string;
  claims: Record<string, any>;
}

export const CurrentUser = createParamDecorator(
  (data: keyof ClerkUser | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as ClerkUser;
    return data ? user?.[data] : user;
  },
);
