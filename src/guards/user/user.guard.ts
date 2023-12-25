import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtTokenService } from '../../shared/services/jwt-token.service';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(private JWTService: JwtTokenService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const token = request.headers.authorization;
      const isValidToken = this.JWTService.verifyToken(token);
      return !!isValidToken;
    } catch (e) {
      return false;
    }
  }
}
