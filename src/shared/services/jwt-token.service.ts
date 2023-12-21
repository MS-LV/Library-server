import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtTokenService {
  constructor(private config: ConfigService) {}

  async genAccessToken(payload: object): Promise<string> {
    const secret = this.config.get('JWTSecret');
    return jwt.sign(payload, secret, { expiresIn: '365d' });
  }

  verifyToken(token: string): string | jwt.JwtPayload {
    try {
      const secret = this.config.get('JWTSecret');
      token = token.split(' ').at(-1);
      return jwt.verify(token, secret);
    } catch (e) {
      return null;
    }
  }

  async genAdminAccessToken(payload: object): Promise<string> {
    const secret = this.config.get('JWTAdminSecret');
    return jwt.sign(payload, secret, { expiresIn: '365d' });
  }

  verifyAdminToken(token: string) {
    try {
      const secret = this.config.get('JWTAdminSecret');
      token = token?.split(' ').at(-1);
      return jwt?.verify(token, secret);
    } catch (e) {
      return null;
    }
  }
}
