import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AUTH_CONFIG_KEY, AuthConfig } from '@gedu/config';
import { JwtPayload } from './jwt.interface';

/**
 * Passport JWT strategy for API authentication.
 * Injects AuthConfig via AUTH_CONFIG_KEY to build verification options.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(AUTH_CONFIG_KEY)
    private readonly authConfig: AuthConfig
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: authConfig.jwtSecret,
    });
  }

  /**
   * Transforms/filters the JWT payload into the Passport user object.
   */
  async validate(payload: JwtPayload) {
    return {
      sub: payload.sub,
      email: payload.email,
      id: payload.id,
      orgId: payload.orgId,
    };
  }
}
