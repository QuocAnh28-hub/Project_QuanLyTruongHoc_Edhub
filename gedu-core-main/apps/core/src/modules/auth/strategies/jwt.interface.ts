/**
 * JWT payload carried in access tokens.
 * Note: iat/exp are attached by the JWT library and are optional here.
 */
export interface JwtPayload {
  sub: number;
  email: string;
  id: number;
  orgId: number;
  iat?: number;
  exp?: number;
}
