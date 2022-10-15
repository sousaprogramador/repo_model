/* eslint-disable @typescript-eslint/no-unused-vars */
import { Body, Controller, Get, Post, Redirect, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { JwtAuthGuard } from 'src/modules/common/jwt.guard';
import { RolesGuard } from 'src/modules/common/role.guard';
import { Roles } from 'src/modules/common/roles.decorator';
import { InvitationService } from '../services/invitation';
import { Invitation } from '../validators/invitation/save';

@ApiTags('App: Invitation')
@Controller('/invitation')
export class InvitationController {
  constructor(private invitationService: InvitationService) {}

  @Get('/app')
  public async openPinguimApp(@Req() req: Request, @Res() res: Response) {
    const userAgent = req.get('user-agent');

    let myPlatform: string;
    if (/windows phone/i.test(userAgent)) {
      console.log('Windows Phone');
    }

    if (/android/i.test(userAgent)) {
      myPlatform = 'Android';
    }

    if (/iPad|iPhone|iPod/.test(userAgent)) {
      myPlatform = 'iOS';
    }

    if (myPlatform) {
      return res.redirect(myPlatform === 'iOS' ? 'redirect-ios' : 'redirect-android');
    } else {
      return res.send(
        `
          <h1>Ops</h1>
          <p>Não foi possível detectar seu dispositivo, tente acionar o botão pelo seu celular</p>
        `
      );
    }
  }

  @Get('redirect-ios')
  @Redirect('itms-apps://itunes.apple.com/app/pinguim/id1437647772')
  public async redirectIos(@Req() req: Request, @Res() res: Response) {
    const url = `itms-apps://itunes.apple.com/app/pinguim/id1437647772`;

    return { url };
  }

  @Get('redirect-android')
  @Redirect('market://details?id=br.tur.pinguim')
  public async redirectAndroid(@Req() req: Request, @Res() res: Response) {
    const url = `market://details?id=br.tur.pinguim`;

    return { url };
  }

  @Post()
  @Roles('user')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiBody({ type: Invitation })
  @ApiResponse({ status: 201 })
  public async save(@Body() model: Invitation, @Req() req) {
    const apiUrl = req.protocol + '://' + req.get('host');

    const url = `${apiUrl}/app/invitation/app`;

    return this.invitationService.save(model, req.user, url);
  }
}
