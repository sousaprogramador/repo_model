import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info) {
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      if (info.message === 'jwt expired') {
        throw new UnauthorizedException('jwt-token-expired');
      }
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
