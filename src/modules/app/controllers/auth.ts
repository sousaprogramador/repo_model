import { Body, Controller, Patch, Post, Get, Query, Req, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/common/jwt.guard';
import { RolesGuard } from 'src/modules/common/role.guard';
import { Roles } from 'src/modules/common/roles.decorator';
import { User } from 'src/modules/database/models/users.entity';
import { AppAuthGuard } from '../app-auth.guard';
import { AuthService } from '../services/auth';
import {
  AppleLogin,
  FacebookLogin,
  ForgotPass,
  GoogleLogin,
  LoginResponse,
  LoginUserApp,
  ResetPass
} from '../validators/users/login';
import { CreateUsers } from '../validators/users/save';

@ApiTags('App: Auth')
@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('logout')
  @Roles('user')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  async logoutUser(@Req() req): Promise<void> {
    return this.authService.logout(req.user);
  }

  @Post('refresh-token')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        ['refresh_token']: {
          type: 'string'
        }
      }
    },
    description: 'Informar refresh token para receber novo token JWT válido'
  })
  @ApiResponse({ status: 201, type: LoginResponse, description: 'Retorna o token e refresh token atualizados' })
  async refreshToken(@Body('refresh_token') refreshToken: string): Promise<LoginResponse> {
    return this.authService.refreshToken(refreshToken);
  }

  @UseGuards(AppAuthGuard)
  @Post('login')
  @ApiResponse({ status: 201, type: LoginResponse, description: 'Retorna dados do usuário logado' })
  @ApiBody({ type: LoginUserApp, description: 'Email e senha do usuário' })
  async login(@Request() req, @Body('tokenOneSignal') tokenOneSignal?: string) {
    return this.authService.loginUser(req.user, tokenOneSignal);
  }

  @Post('facebook')
  @ApiBody({
    description: 'Entrar/Cadastrar com facebook AccessToken',
    type: FacebookLogin
  })
  @ApiResponse({
    status: 201,
    type: LoginResponse,
    description: 'Retorna dados do usuário logado (Cria ou cadastra usuário)'
  })
  async facebookOAuth(@Body() model: FacebookLogin) {
    return this.authService.facebookSignInOrSignUp(model);
  }
  @Post('google')
  @ApiBody({
    description: 'Entrar/Cadastrar com Google AccessToken',
    type: GoogleLogin
  })
  @ApiResponse({
    status: 201,
    type: LoginResponse,
    description: 'Retorna dados do usuário logado (Cria ou cadastra usuário)'
  })
  async googleOAuth(@Body() model: GoogleLogin) {
    return this.authService.googleSignOrSignUp(model);
  }

  @Post('apple')
  @ApiBody({
    description: 'Entrar/Cadastrar com Apple',
    type: AppleLogin
  })
  @ApiResponse({
    status: 201,
    type: LoginResponse,
    description: 'Retorna dados do usuário logado (Cria ou cadastra usuário)'
  })
  @ApiResponse({ status: 401, description: 'O usuário informado não representa o retornado pela Apple' })
  @ApiResponse({
    status: 500,
    description: 'Erro ao cadastrar usuário ou acessar Apple para verificar chaves'
  })
  async appleLogin(@Body() model: AppleLogin) {
    return this.authService.appleLogin(model);
  }

  @Post('signup')
  @ApiResponse({
    type: User,
    status: 201,
    description: 'Retorna dados do usuário cadastrado'
  })
  @ApiBody({
    description: 'Dados do usuário',
    type: CreateUsers
  })
  async signup(@Body() model: CreateUsers): Promise<LoginResponse> {
    const userCreated = await this.authService.signup(model);
    return this.authService.loginUser(userCreated);
  }

  @Post('/forgot-password')
  @ApiBody({ description: 'Email do usuário que esqueceu a senha', type: ForgotPass })
  @ApiResponse({
    status: 201,
    description: 'Envia o email para usuário com instruções para realizar a alteração da senha'
  })
  async forgotPassword(@Body('email') email: string, @Request() req): Promise<void> {
    const apiUrl = req.protocol + '://' + req.get('host');
    return this.authService.forgotPassword(email, apiUrl);
  }

  @Post('/reset-password')
  @ApiBody({ description: 'Dados de recuperação de senha', type: ResetPass })
  @ApiResponse({
    status: 201,
    description: 'Confirma a alteração de senha do usuário'
  })
  async resetPassword(
    @Body()
    model: ResetPass
  ): Promise<void> {
    return this.authService.resetPassword(model);
  }

  @Patch('/resend-confirmation-email')
  public async resendConfirmationEmail(@Body('email') email: string, @Request() req): Promise<void> {
    return this.authService.resendConfirmationEmail(email);
  }

  @Get('/confirm-email')
  public async confirmEmail(@Query('email') email: string, @Query('token') token: string): Promise<LoginResponse> {
    const user = await this.authService.confirmEmail(email, token);
    return this.authService.loginUser(user);
  }
}
