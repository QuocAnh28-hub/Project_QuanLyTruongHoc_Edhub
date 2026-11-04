import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

import { AppExceptionDetail } from '@gedu/shared';
import { AuthGuard } from '@nestjs/passport';
import { Authorization } from '../decorators/authorization.decorators';
import { JwtPayload } from '../strategies/jwt.interface';
import { PrismaService } from '@gedu/prisma';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context);

    const requiredRoles =
      this.reflector.getAllAndMerge<string[]>(Authorization, [
        context.getHandler(),
        context.getClass(),
      ]) ?? [];

    if (requiredRoles.length === 0) {
      return true;
    }

    const { user }: { user: JwtPayload } = context.switchToHttp().getRequest();
    if (!user?.id) {
      throw new ForbiddenException(AppExceptionDetail.UN_AUTHORIZATION.message);
    }

    const userRoles = await this.getUserRoles(user.id);

    if (!this.processAuthorization(userRoles, requiredRoles)) {
      throw new ForbiddenException(AppExceptionDetail.UN_AUTHORIZATION.message);
    }

    return true;
  }

  private processAuthorization(userRoles: string[], requiredRoles: string[]) {
    const roleSet = new Set(userRoles.map((r) => r.toLowerCase()));
    const required = requiredRoles.map((r) => r.toLowerCase());
    return required.some((r) => roleSet.has(r));
  }

  private async getUserRoles(userId: number) {
    const account = await this.prisma.account.findFirst({
      where: {
        userId,
      },
      select: { roles: true },
    });
    if (!account || !account.roles) {
      throw new ForbiddenException(AppExceptionDetail.UN_AUTHORIZATION.message);
    }
    return account.roles
      .split(',')
      .map((r) => r.trim())
      .filter((r) => r.length > 0);
  }
}
