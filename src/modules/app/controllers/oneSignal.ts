import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from 'src/modules/common/jwt.guard';
import { RolesGuard } from 'src/modules/common/role.guard';
import { Roles } from 'src/modules/common/roles.decorator';
import { OneSignalService } from '../services/oneSignal';
import { CreateNotification } from '../validators/onesignal/save';

@ApiTags('App: OneSignal (Notificação)')
@Roles('user')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller('oneSignal')
export class OneSignalController {
  constructor(private oneSignalService: OneSignalService) {}

  @ApiResponse({ status: 201, description: 'Notificação enviada' })
  @ApiBody({ type: CreateNotification, description: 'Dados para envio de uma notificação para outro usuário' })
  @Post()
  public async sendNotification(@Body() body: CreateNotification) {
    return this.oneSignalService.sendNotification(body);
  }
}
