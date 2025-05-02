import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/users/entities/user.entity';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';

@Controller('invoices')
@UseGuards(JwtAuthGuard)
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.CLIENT)
  create(@Body() createInvoiceDto: CreateInvoiceDto, @Req() req) {
    const clientId = req.user.id;
    return this.invoicesService.create(createInvoiceDto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.CLIENT, UserRole.FREELANCER)
  findAll(@Req() req) {
    const userId = req.user.id;
    const userRole = req.user.role;
    return this.invoicesService.findAll(userId, userRole);
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.CLIENT, UserRole.FREELANCER)
  findOne(@Param('id') id: number, @Req() req) {
    const userId = req.user.id;
    const userRole = req.user.role;
    return this.invoicesService.findOne(id, userId, userRole);
  }

  @Patch(':id/pay')
  @UseGuards(RolesGuard)
  @Roles(UserRole.CLIENT)
  markAsPaid(@Param('id') id: number, @Req() req) {
    const clientId = req.user.id;
    return this.invoicesService.markAsPaid(id, clientId);
  }
}
