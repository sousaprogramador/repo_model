import { Controller, Request, Post, UseGuards, Body } from '@nestjs/common';
import { AuthService } from '../services/auth';
import { AdminAuthGuard } from '../admin-auth.guard';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ForgotPass, LoginResponseAdmin, LoginAdmin, ResetPass } from '../validators/users/login';
@ApiTags('Admin: Auth')
@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('refresh')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        ['refresh_token']: {
          type: 'string'
        }
      }
    }
  })
  @ApiResponse({ status: 200, type: LoginResponseAdmin, description: 'Atualiza token expirado do usuário' })
  async refreshToken(@Body('refresh_token') refreshToken: string): Promise<LoginResponseAdmin> {
    return this.authService.refreshToken(refreshToken);
  }

  @UseGuards(AdminAuthGuard)
  @Post('login')
  @ApiResponse({ status: 200, type: LoginResponseAdmin, description: 'Dados do usuário logado' })
  @ApiBody({ description: 'Dados de login', type: LoginAdmin })
  async login(@Request() req) {
    return this.authService.loginAdmin(req.user);
  }

  @Post('/forgot-password')
  @ApiBody({ description: 'Dados de recuperação de senha', type: ForgotPass })
  async forgotPassword(@Body('email') email: string): Promise<void> {
    return this.authService.forgotPassword(email);
  }

  @Post('/reset-password')
  @ApiBody({ description: 'Dados de recuperação de senha', type: ResetPass })
  async resetPassword(
    @Body()
    model: ResetPass
  ): Promise<void> {
    return this.authService.resetPassword(model);
  }
}
