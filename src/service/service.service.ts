import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServiceService {
  constructor(private prisma: PrismaService) { }

  async create(dto: CreateServiceDto, userId: number) {
    const daysString = Array.isArray(dto.availableDays)
      ? dto.availableDays.join(', ')
      : dto.availableDays || '';

    return this.prisma.service.create({
      data: {
        ...dto,
        availableDays: daysString,
        providerId: userId,
      },
    });
  }

  async findAll() {
    return this.prisma.service.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        provider: { select: { name: true } }
      },
    });
  }

  async findMine(providerId: number) {
    return this.prisma.service.findMany({
      where: { providerId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: number, providerId: number, dto: UpdateServiceDto) {
    const updateData: any = { ...dto };
    if (dto.availableDays !== undefined) {
      updateData.availableDays = Array.isArray(dto.availableDays)
        ? dto.availableDays.join(', ')
        : dto.availableDays || '';
    }

    return this.prisma.service.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: number, providerId: number) {
    const service = await this.prisma.service.findUnique({ where: { id } });
    if (!service) throw new NotFoundException('Serviço não encontrado');
    if (service.providerId !== providerId) throw new ForbiddenException('Você não pode excluir este serviço');

    return this.prisma.service.delete({ where: { id } });
  }
}
