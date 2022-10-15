import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './services/auth';

@Injectable()
export class AppStrategy extends PassportStrategy(Strategy, 'user') {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<any> {
    try {
      if (!email || !password) throw new UnauthorizedException('login-failed');

      const user = await this.authService.validateUser(email, password);

      if (!user) {
        throw new UnauthorizedException('login-failed');
      }

      if (!user.status) throw new UnauthorizedException('user-is-not-active');

      return user;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
