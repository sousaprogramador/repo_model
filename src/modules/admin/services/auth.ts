import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as dayjs from 'dayjs';
import { RefreshToken } from 'src/modules/database/models/refreshToken.entity';
import { MailService } from 'src/modules/mail/mail.service';
import { FRONT_ADMIN_URL } from 'src/settings';
import { User } from '../../database/models/users.entity';
import { LoginResponseAdmin, ResetPass } from '../validators/users/login';
import { UsersService } from './users';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService, private mailService: MailService) {}

  private async generateRefreshToken(userId: number): Promise<RefreshToken> {
    const generatedRefreshToken = {
      expiresIn: dayjs().add(7, 'day').unix(),
      token: bcrypt.genSaltSync(userId)
    };

    const refreshToken = await RefreshToken.findOne({
      where: {
        userId
      }
    });

    if (!refreshToken) {
      return RefreshToken.save({
        userId,
        expiresIn: generatedRefreshToken.expiresIn,
        refreshToken: generatedRefreshToken.token
      } as RefreshToken);
    } else {
      return RefreshToken.save({
        id: refreshToken.id,
        userId,
        expiresIn: generatedRefreshToken.expiresIn,
        refreshToken: generatedRefreshToken.token
      } as RefreshToken);
    }
  }

  async refreshToken(token: string): Promise<LoginResponseAdmin> {
    // bucas na tabela certa
    const refreshToken = await RefreshToken.findOne({
      where: {
        refreshToken: token
      }
    });

    if (!refreshToken) throw new UnauthorizedException('invalid-refresh-token');

    const isExpires = dayjs().isAfter(dayjs.unix(refreshToken.expiresIn));

    let newRefreshToken: RefreshToken = null;

    if (isExpires) {
      newRefreshToken = await this.generateRefreshToken(refreshToken.userId);
    }

    const user = await this.usersService.findOne({
      id: refreshToken.userId
    });

    if (!user) throw new UnauthorizedException('invalid-user');

    if (user.roles !== 'admin' && user.roles !== 'sysAdmin') throw new UnauthorizedException('invalid-user');

    const payload = { email: user.email, sub: user.id, roles: user.roles };

    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: {
        refresh_token: isExpires ? newRefreshToken.refreshToken : refreshToken.refreshToken,
        expiresIn: isExpires ? newRefreshToken.expiresIn : refreshToken.expiresIn
      }
    };
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findUserByEmail(email);

    if (!user) throw new UnauthorizedException('invalid-email');

    const isValid = await bcrypt.compare(pass, user.password);

    if (isValid) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async loginAdmin(user: any): Promise<LoginResponseAdmin> {
    if (user.roles !== 'admin' && user.roles !== 'sysAdmin') throw new UnauthorizedException('invalid-user');

    const payload = { email: user.email, sub: user.id, roles: user.roles };

    const refreshToken = await this.generateRefreshToken(user.id);

    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: {
        expiresIn: refreshToken.expiresIn,
        refresh_token: refreshToken.refreshToken
      },
      id: user.id,
      email: user.email,
      roles: user.roles
    };
  }

  async forgotPassword(email: string): Promise<void> {
    try {
      const user = await this.usersService.findUserByEmail(email);

      if (!user) throw new UnauthorizedException('invalid-email');

      const tokenPayload = {
        id: user.id,
        email: user.email,
        createadAt: new Date()
      };

      const rememberToken = this.jwtService.sign(tokenPayload, {
        expiresIn: '1h'
      });
      // Salvando token no usuario
      user.rememberToken = rememberToken;
      await user.save();

      const url = `${FRONT_ADMIN_URL}/#/auth/reset-password?token=${rememberToken}`;

      await this.mailService.sendForgotPassword(user, url);
    } catch (e) {
      console.log('e', e);
      throw new UnauthorizedException('error-forgot-password');
    }
  }

  async resetPassword(model: ResetPass): Promise<void> {
    const { confirmPassword, password, token } = model;

    if (!confirmPassword || !password) throw new UnauthorizedException('invalid-password');

    if (confirmPassword !== password) throw new UnauthorizedException('passwords-do-not-match');

    try {
      await this.jwtService.verifyAsync(token);

      const { email } = this.jwtService.decode(token) as User;

      const user = await this.usersService.findUserByEmailAndToken(token, email);

      if (!user) throw new UnauthorizedException('invalid-token');

      // Salvando nova senha
      const newPassword = await this.usersService.hashPassword(password);
      user.password = newPassword;
      user.rememberToken = null;
      await user.save();
    } catch (e) {
      if (e.name === 'TokenExpiredError') {
        throw new UnauthorizedException('token-expired');
      }
      throw new UnauthorizedException('error-reset-password');
    }
  }
}
