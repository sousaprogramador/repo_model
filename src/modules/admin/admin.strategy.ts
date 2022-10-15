import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './services/auth';
import { UsersService } from './services/users';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'admin') {
  constructor(private authService: AuthService, private userService: UsersService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<any> {
    try {
      const user = await this.authService.validateUser(email, password);

      if (!user) {
        throw new UnauthorizedException('login-failed');
      }

      return user;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
