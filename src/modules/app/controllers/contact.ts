/* eslint-disable @typescript-eslint/no-unused-vars */
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/common/jwt.guard';
import { RolesGuard } from 'src/modules/common/role.guard';
import { Roles } from 'src/modules/common/roles.decorator';
import { Contact } from 'src/modules/database/models/contact.entity';
import { ContactService } from '../services/contact';
import { ListContacts } from '../validators/contact/get';
import { CreateContact } from '../validators/contact/save';

@ApiTags('App: Contact')
@Roles('user')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller('/contact')
export class ContactController {
  constructor(private contactService: ContactService) {}

  @Get()
  @ApiResponse({ status: 200 })
  public async list(@Query() params: ListContacts, @Req() req) {
    return this.contactService.list(params, req.user);
  }

  @Post()
  @ApiBody({
    type: CreateContact
  })
  @ApiResponse({ status: 201, type: Contact })
  public async save(@Body() model: CreateContact, @Req() req) {
    return this.contactService.save(model, req.user);
  }

  @Get(':contactId')
  @ApiResponse({ status: 200, type: Contact })
  public async details(@Param('contactId', ParseIntPipe) contactId: number) {
    return this.contactService.findById(contactId);
  }

  @Delete(':contactId')
  public async delete(@Param('contactId', ParseIntPipe) contactId: number) {
    return this.contactService.remove(contactId);
  }
}
