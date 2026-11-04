import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import { JwtPayload } from '../strategies/jwt.interface';

/**
 * Extracts the authenticated user (or a specific field) from the request.
 * Example: `@User('orgId') orgId: number`
 */
export const User = createParamDecorator<
  keyof JwtPayload | undefined,
  ExecutionContext
>((data, ctx) => {
  const request = ctx.switchToHttp().getRequest();
  const user = request.user as JwtPayload | undefined;
  return data ? user?.[data] : user;
});
