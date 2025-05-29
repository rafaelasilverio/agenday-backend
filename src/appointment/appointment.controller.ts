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

@UseGuards(JwtAuthGuard)
@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  create(@Request() req, @Body() dto: CreateAppointmentDto) {
    console.log('DEBUG: req.user =', req.user);
    return this.appointmentService.create(req.user.userId, dto);
  }

  @Get()
  findAll(@Request() req) {
    return this.appointmentService.findAll(req.user.userId, req.user.role);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Request() req,
    @Body() dto: UpdateAppointmentDto
  ) {
    return this.appointmentService.update(+id, req.user.userId, dto);
  }

  @Patch(':id/cancel')
  cancel(@Param('id') id: string, @Request() req) {
    return this.appointmentService.cancel(+id, req.user.userId);
  }
}
