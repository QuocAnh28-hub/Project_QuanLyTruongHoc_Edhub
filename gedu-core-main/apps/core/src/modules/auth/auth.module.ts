import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AUTH_CONFIG_KEY } from '@gedu/config';
import type { AuthConfig } from '@gedu/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from '@gedu/prisma';

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: async (authConfig: AuthConfig) => ({
        secret: authConfig.jwtSecret,
        signOptions: { expiresIn: authConfig.jwtExpiresIn },
      }),
      inject: [AUTH_CONFIG_KEY],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {} 