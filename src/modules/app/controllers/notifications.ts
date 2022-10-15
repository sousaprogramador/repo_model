/* eslint-disable @typescript-eslint/no-unused-vars */
import { Body, Controller, Get, Param, ParseIntPipe, Put, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/common/jwt.guard';
import { RolesGuard } from 'src/modules/common/role.guard';
import { Roles } from 'src/modules/common/roles.decorator';
import { NotificationsService } from '../services/notifications';
import { UpdateLastStatus } from '../validators/aggregatedNotifications/update';
import { ListUnreadNotifications } from '../validators/notifications/getUnreadsNotifications';

@ApiTags('App: Notifications')
@Controller('notifications')
@Roles('user')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class NotificationController {
  constructor(private notificationsService: NotificationsService) {}

  @Get('unreads')
  @ApiResponse({ status: 200, description: 'Verificar quantas curtidas não lidas pelo usuário' })
  public async getUnreadsNotificationsQuantityByUser(@Req() req): Promise<ListUnreadNotifications> {
    return await this.notificationsService.getUnreadsNotificationsQuantityByUser(req.user);
  }

  @Get('')
  @ApiResponse({ status: 200, description: 'Retornar todas as notificações do usuário' })
  public async getAllNotifications(@Req() req, @Query() params) {
    return this.notificationsService.getNotifications(req.user, params);
  }

  @Put('status/:aggregatedNotificationId')
  @ApiResponse({ status: 201, description: 'Alterar o status da notificação agregada' })
  @ApiBody({
    type: UpdateLastStatus
  })
  public async updateLastStatus(
    @Param('aggregatedNotificationId', ParseIntPipe) aggregatedNotificationId: number,
    @Body() model: UpdateLastStatus,
    @Req() req
  ): Promise<any> {
    return this.notificationsService.updateLastStatus(
      { id: aggregatedNotificationId, lastStatus: model.status },
      req.user
    );
  }
}
