import { BadRequestException, Injectable, Logger, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
import * as bcrypt from 'bcrypt';
import * as dayjs from 'dayjs';
import { CreateUsers } from 'src/modules/app/validators/users/save';
import { RefreshToken } from 'src/modules/database/models/refreshToken.entity';
import { Term } from 'src/modules/database/models/terms.entity';
import { MailService } from 'src/modules/mail/mail.service';
import {
  CHAT_KEY,
  CHAT_SECRET,
  FACEBOOK_APP_ID,
  FACEBOOK_APP_SECRET,
  FACEBOOK_OAUTH_URL,
  GOOGLE_OAUTH_URL,
  FRONT_WEB_URL,
  FEATFLAGS
} from 'src/settings';
import { StreamChat } from 'stream-chat';
import { getRepository } from 'typeorm';
import { User } from '../../database/models/users.entity';
import { AppleLogin, FacebookLogin, GoogleLogin, LoginResponse, ResetPass } from '../validators/users/login';
import { UsersService } from './users';
@Injectable()
export class AuthService {
  logger: Logger;
  constructor(private usersService: UsersService, private jwtService: JwtService, private mailService: MailService) {
    this.logger = new Logger('AuthService');
  }

  async logout(userLogged: Partial<User>) {
    try {
      const user = await this.usersService.findById(userLogged.id);

      if (!user) throw new BadRequestException('user-not-found');

      await User.save({
        id: user.id,
        tokenOneSignal: null
      } as User);
    } catch (error) {
      this.logger.error(error);

      if (!error.message) throw new BadRequestException('logout-failed');

      throw error;
    }
  }

  generateGetStreamToken = (user: Partial<User>) => {
    const api_key = CHAT_KEY;
    const api_secret = CHAT_SECRET;

    let chatToken;
    try {
      const serverClient = StreamChat.getInstance(api_key, api_secret);
      chatToken = serverClient.createToken('' + user.id);
    } catch (e) {
      console.log('Error: ', e);
    }
    return chatToken;
  };

  async validateUser(email: string, pass: string): Promise<any> {
    try {
      const user = await this.usersService.findUserByEmail(email);

      if (!user) throw new UnauthorizedException('invalid-email');

      if (!user.password) {
        this.logger.log('Usuário não possui senha');
        throw new UnauthorizedException('login-failed');
      }

      const isValid = await bcrypt.compare(pass, user.password);

      if (isValid) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...result } = user;
        return result;
      }
      return null;
    } catch (e) {
      this.logger.error('error validateUser', e);
      if (!e.message) throw new UnauthorizedException('error-validate-password');

      throw e;
    }
  }

  private async generateRefreshToken(userId: number): Promise<RefreshToken> {
    const generatedRefreshToken = {
      expiresIn: dayjs().add(60, 'day').unix(),
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

  async refreshToken(token: string): Promise<LoginResponse> {
    // bucas na tabela certa
    const refreshToken = await RefreshToken.findOne({
      where: {
        refreshToken: token
      }
    });

    if (!refreshToken) throw new UnauthorizedException('invalid-refresh-token');

    // const isExpires = dayjs().isAfter(dayjs.unix(refreshToken.expiresIn));

    // if (isExpires) throw new UnauthorizedException('token-expired');

    const newRefreshToken = await this.generateRefreshToken(refreshToken.userId);

    const user = await this.usersService.findOne({
      id: refreshToken.userId
    });

    if (!user) throw new UnauthorizedException('invalid-user');

    if (!user.status) throw new UnauthorizedException('user-is-not-active');

    if (user.roles !== 'user') throw new UnauthorizedException('invalid-user');

    const payload = { email: user.email, sub: user.id, roles: user.roles };

    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: {
        refresh_token: newRefreshToken.refreshToken,
        expiresIn: newRefreshToken.expiresIn
      }
    };
  }

  async loginUser(user: Partial<User>, tokenOneSignal?: string): Promise<LoginResponse> {
    try {
      if (user.roles !== 'user') throw new UnauthorizedException('invalid-user');

      // if ((user.emailConfirmed === 'NOT_CONFIRMED') && FEATFLAGS.LOGIN_NEEDS_EMAIL_CONFIRMATION) {
      //   throw new UnauthorizedException('email-not-valited');
      // }

      const payload = { email: user.email, sub: user.id, roles: user.roles };

      if (tokenOneSignal) {
        await User.save({
          id: user.id,
          lastLogin: new Date(),
          tokenOneSignal
        } as User);

        // await this.usersService.updateProfile(
        //   {
        //     id: user.id,
        //     tokenOneSignal
        //   } as UpdateUser,
        //   user
        // );
      } else {
        await User.save({
          id: user.id,
          lastLogin: new Date()
        } as User);
      }

      const refreshToken = await this.generateRefreshToken(user.id);
      const chatToken = this.generateGetStreamToken(user);

      const userData = await this.usersService.findById(user.id, true);

      delete userData.emailConfirmationToken;

      // TODO: Verificar onde isso era usado
      // const lastTerm = await getRepository(Term)
      //   .createQueryBuilder('term')
      //   .where('status = 1')
      //   .orderBy('term.id', 'DESC')
      //   .getOne();

      return {
        access_token: this.jwtService.sign(payload),
        refresh_token: {
          refresh_token: refreshToken.refreshToken,
          expiresIn: refreshToken.expiresIn
        },
        user: {
          ...userData,
          isMissingData: this.usersService.isMissingData(userData)
        } as User,
        chatToken: chatToken ? chatToken : null

        // lastTerm: userData.termId !== lastTerm?.id ? lastTerm : null
      };
    } catch (e) {
      this.logger.error(e);
      if (!e.message) throw new UnauthorizedException('error-login');

      throw e;
    }
  }

  async googleSignOrSignUp(model: GoogleLogin): Promise<LoginResponse> {
    const { accessToken, googleId, tokenOneSignal, ...rest } = model;

    try {
      const { status, data } = await axios.get(`${GOOGLE_OAUTH_URL}tokeninfo?access_token=${accessToken}`);

      if (status !== 200) throw new UnauthorizedException('invalid-access-token');

      if (data.sub !== googleId) throw new UnauthorizedException('invalid-google-id');

      const googleData = {
        googleId: data.sub,
        email: data.email,
        ...rest
      } as Partial<User>;

      const user = await this.usersService.findOrCreateByGoogleId(googleId, googleData);

      if (!user.status) throw new UnauthorizedException('user-is-not-active');

      return this.loginUser(user, tokenOneSignal);
    } catch (error) {
      this.logger.error('invalid-access-token-or-google-id', error);
      throw new UnauthorizedException('invalid-access-token');
    }
  }

  async facebookSignInOrSignUp(model: FacebookLogin): Promise<LoginResponse> {
    const { accessToken, tokenOneSignal } = model;

    try {
      // gerar um token de acesso do aplicativo
      const responseToken = await axios.get(`${FACEBOOK_OAUTH_URL}oauth/access_token`, {
        params: {
          client_id: FACEBOOK_APP_ID,
          client_secret: FACEBOOK_APP_SECRET,
          grant_type: 'client_credentials'
        }
      });

      const appAccessToken = responseToken.data.access_token;

      // token do usuario de longa duração
      const response = await axios.get(`${FACEBOOK_OAUTH_URL}oauth/access_token`, {
        params: {
          client_id: FACEBOOK_APP_ID,
          client_secret: FACEBOOK_APP_SECRET,
          grant_type: 'client_credentials',
          fb_exchange_token: accessToken
        }
      });

      const userToken = response.data.access_token;

      const user = await this.usersService.checkFacebookAccessToken(userToken, appAccessToken, accessToken);

      if (!user.status) throw new UnauthorizedException('user-is-not-active');

      return this.loginUser(user, tokenOneSignal);
    } catch (error) {
      this.logger.error('erro facebookSignInOrSignUp', error);
      if (!error.message) throw new UnauthorizedException('invalid-access-token');

      throw error;
    }
  }

  async appleLogin(model: AppleLogin): Promise<LoginResponse> {
    const { tokenOneSignal } = model;
    try {
      const user = await this.usersService.findOrCreateByApple(model);

      return this.loginUser(user, tokenOneSignal);
    } catch (e) {
      this.logger.error('error appleLogin', e);
      if (!e.message) throw new UnauthorizedException('error-login');
      throw e;
    }
  }

  async signup(model: CreateUsers): Promise<User> {
    try {
      return this.usersService.signup(model);
    } catch (e) {
      this.logger.error('error signup', e);

      if (!e.message) throw new UnauthorizedException('error-signup');

      throw e;
    }
  }

  async forgotPassword(email: string, apiUrl: string): Promise<void> {
    try {
      const user = await this.usersService.findUserByEmail(email);

      if (!user) return;

      delete user.languages;

      const tokenPayload = {
        id: user.id,
        email: user.email,
        createadAt: new Date()
      };

      const rememberToken = this.jwtService.sign(tokenPayload, {
        expiresIn: '12h'
      });
      // Salvando token no usuario
      user.rememberToken = rememberToken;
      await user.save();

      // É usado essa url onde tem aponta para a API, pois ele testa qual o device e redirecional para um link do APP ou para o site
      const url = `${apiUrl}/app/users/forgot-password/${rememberToken}`;
      // const url = `${FRONT_WEB_URL}/recuperacao-de-senha-nest/?t=${rememberToken}`;

      await this.mailService.sendForgotPassword(user, url);
      return;
    } catch (e) {
      this.logger.error('error forgotPassword', e);
      if (!e.message) throw new UnauthorizedException('error-forgot-password');
      throw e;
    }
  }

  async resetPassword(model: ResetPass): Promise<void> {
    const { confirmPassword, password, token } = model;

    if (!confirmPassword || !password) throw new UnauthorizedException('invalid-password');

    if (confirmPassword !== password) throw new UnauthorizedException('passwords-do-not-match');

    try {
      await this.jwtService.verifyAsync(token);

      const { email } = this.jwtService.decode(token) as User;

      const user = await this.usersService.findUserByEmailAndToken(email, token);

      if (!user) throw new BadRequestException('invalid-token');

      if (!user.status) throw new BadRequestException('user-is-not-active');
      // Salvando nova senha
      const newPassword = await this.usersService.hashPassword(password);

      await User.save({
        id: user.id,
        password: newPassword,
        rememberToken: null
      } as User);
    } catch (e) {
      this.logger.error('error resetPassword', e);
      if (e.name === 'TokenExpiredError') {
        throw new BadRequestException('token-expired');
      }
      if (e.name === 'JsonWebTokenError') {
        throw new BadRequestException('invalid-token');
      }
      throw new BadRequestException('error-reset-password');
    }
  }

  async resendConfirmationEmail(email: string): Promise<void> {
    await this.usersService.resendConfirmation(email);
  }

  async confirmEmail(email: string, token: string): Promise<Partial<User>> {
    const foundUser = await this.usersService.getConfirmationToken(email);

    if (!foundUser) throw new NotFoundException('user-not-found');

    if (foundUser.emailConfirmed !== 'NOT_CONFIRMED') { // TODO compare with global enum
      throw new BadRequestException('email-already-confirmed');
    }

    if (foundUser.emailConfirmationToken !== token) throw new BadRequestException('wrong-token');

    foundUser.emailConfirmationToken = null;
    foundUser.emailConfirmed = 'CONFIRMED'; // Todo set using global enum
    delete foundUser.languages;

    const finalUser = await foundUser.save();
    await this.mailService.sendUserSuccessConfirmation(foundUser.name, foundUser.email);

    return { email: foundUser.email, id: foundUser.id, roles: foundUser.roles };
  }
}
