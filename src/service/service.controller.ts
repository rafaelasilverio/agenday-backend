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
    const userId = Number(req.user.userId ?? req.user.sub);
    return this.serviceService.create(dto, userId);
  }

  @Get()
  findAll() {
    return this.serviceService.findAll();
  }

  @Get('mine')
  @Roles('PROVIDER')
  findMine(@Request() req) {
    const userId = Number(req.user.userId ?? req.user.sub);
    return this.serviceService.findMine(userId);
  }

  @Put(':id')
  @Roles('PROVIDER')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() dto: UpdateServiceDto,
  ) {
    const userId = Number(req.user.userId ?? req.user.sub);
    return this.serviceService.update(+id, userId, dto);
  }

  @Delete(':id')
  @Roles('PROVIDER')
  remove(@Request() req, @Param('id') id: string) {
    const userId = Number(req.user.userId ?? req.user.sub);
    return this.serviceService.remove(+id, userId);
  }
}
