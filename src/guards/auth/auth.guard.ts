import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtTokenService } from '../../shared/services/jwt-token.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private JWTService: JwtTokenService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const token = request.headers.authorization;
      const isAdmin = this.JWTService.verifyAdminToken(token);
      const isUser = this.JWTService.verifyToken(token);
      return !!isAdmin || !!isUser;
    } catch (e) {
      return false;
    }
  }
}
