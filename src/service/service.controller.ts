// src/service/service.controller.ts
import {
  Controller, Post, Get, Put, Delete, Param, Body, Request, UseGuards,
} from '@nestjs/common';
import { ServiceService } from './service.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('services')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) { }

  @Post()
  @Roles('PROVIDER')
  create(@Body() dto: CreateServiceDto, @Request() req) {
    return this.serviceService.create(dto, req.user.sub);
  }

  @Get()
  findAll() {
    return this.serviceService.findAll();
  }

  @Get('mine')
  @Roles('PROVIDER')
  findMine(@Request() req) {
    return this.serviceService.findMine(req.user.sub);
  }

  @Put(':id')
  @Roles('PROVIDER')
  update(@Request() req, @Param('id') id: string, @Body() dto: UpdateServiceDto) {
    return this.serviceService.update(+id, req.user.sub, dto);
  }

  @Delete(':id')
  @Roles('PROVIDER')
  remove(@Request() req, @Param('id') id: string) {
    return this.serviceService.remove(+id, req.user.sub);
  }
}
