/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Delete, Get, Param, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/common/jwt.guard';
import { RolesGuard } from 'src/modules/common/role.guard';
import { Roles } from 'src/modules/common/roles.decorator';
import { Contact } from 'src/modules/database/models/contact.entity';
import { ContactService } from '../services/contact';
import { ListContacts } from '../validators/contact/get';

@ApiTags('Admin: Contact')
@Roles('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller('/contact')
export class ContactController {
  constructor(private contactService: ContactService) {}

  @Get()
  @ApiResponse({ status: 200 })
  public async list(@Query() params: ListContacts) {
    return this.contactService.list(params);
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
