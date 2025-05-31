import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  Param,
  Put,
  Patch,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Appointments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo agendamento' })
  @ApiResponse({ status: 201, description: 'Agendamento criado com sucesso' })
  @ApiBody({ type: CreateAppointmentDto })
  create(@Request() req, @Body() dto: CreateAppointmentDto) {
    return this.appointmentService.create(req.user.userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar agendamentos do usuário ou todos se for admin' })
  @ApiResponse({ status: 200, description: 'Lista de agendamentos retornada com sucesso' })
  findAll(@Request() req) {
    return this.appointmentService.findAll(req.user.userId, req.user.role);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar detalhes de um agendamento específico' })
  @ApiResponse({ status: 200, description: 'Agendamento retornado com sucesso' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.appointmentService.findOne(+id, req.user.userId, req.user.role);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar a data de um agendamento (cliente)' })
  @ApiResponse({ status: 200, description: 'Agendamento atualizado com sucesso' })
  @ApiBody({ type: UpdateAppointmentDto })
  update(@Param('id') id: string, @Request() req, @Body() dto: UpdateAppointmentDto) {
    return this.appointmentService.update(+id, req.user.userId, dto);
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Cancelar agendamento (cliente)' })
  @ApiResponse({ status: 200, description: 'Agendamento cancelado com sucesso' })
  cancel(@Param('id') id: string, @Request() req) {
    return this.appointmentService.cancel(+id, req.user.userId);
  }

  @Get('my-services')
  @Roles('PROVIDER')
  @ApiOperation({ summary: 'Listar agendamentos dos serviços do provider logado' })
  @ApiResponse({ status: 200, description: 'Lista de agendamentos retornada com sucesso' })
  findByProvider(@Request() req) {
    return this.appointmentService.findByProvider(req.user.userId);
  }

  @Patch(':id/status')
  @Roles('PROVIDER')
  @ApiOperation({ summary: 'Alterar status de um agendamento (provider)' })
  @ApiResponse({ status: 200, description: 'Status atualizado com sucesso' })
  @ApiBody({ type: UpdateStatusDto })
  updateStatusAsProvider(
    @Param('id') id: string,
    @Request() req,
    @Body() dto: UpdateStatusDto,
  ) {
    return this.appointmentService.updateStatusAsProvider(+id, req.user.userId, dto);
  }

  @Patch(':id/reschedule')
  @Roles('PROVIDER')
  @ApiOperation({ summary: 'Remarcar data de um agendamento (provider)' })
  @ApiResponse({ status: 200, description: 'Data remarcada com sucesso' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        date: { type: 'string', example: '2025-07-10T10:00:00Z' },
      },
    },
  })
  reschedule(
    @Param('id') id: string,
    @Request() req,
    @Body('date') newDate: string,
  ) {
    return this.appointmentService.reschedule(+id, req.user.userId, newDate);
  }
}
