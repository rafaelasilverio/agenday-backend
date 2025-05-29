import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServiceService {
  constructor(private prisma: PrismaService) {}

  async create(providerId: number, dto: CreateServiceDto) {
    return this.prisma.service.create({
      data: {
        ...dto,
        providerId,
      },
    });
  }

  async findAll() {
    return this.prisma.service.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findMine(providerId: number) {
    return this.prisma.service.findMany({
      where: { providerId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: number, providerId: number, dto: UpdateServiceDto) {
    const service = await this.prisma.service.findUnique({ where: { id } });
    if (!service) throw new NotFoundException('Serviço não encontrado');
    if (service.providerId !== providerId) throw new ForbiddenException('Você não tem permissão para editar este serviço');

    return this.prisma.service.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number, providerId: number) {
    const service = await this.prisma.service.findUnique({ where: { id } });
    if (!service) throw new NotFoundException('Serviço não encontrado');
    if (service.providerId !== providerId) throw new ForbiddenException('Você não pode excluir este serviço');

    return this.prisma.service.delete({ where: { id } });
  }
}
