import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

@Injectable()
export class AppointmentService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, dto: CreateAppointmentDto) {
    const service = await this.prisma.service.findUnique({
      where: { id: dto.serviceId },
    });

    if (!service) {
      throw new NotFoundException('Serviço não encontrado');
    }

    return this.prisma.appointment.create({
      data: {
        title: dto.title,
        description: dto.description,
        date: new Date(dto.date),
        user: { connect: { id: userId } },
        service: { connect: { id: dto.serviceId } },
      },
    });
  }

  async findAll(userId: number, role: 'CLIENT' | 'PROVIDER' | 'ADMIN') {
    if (role === 'ADMIN') {
      return this.prisma.appointment.findMany({
        orderBy: { date: 'asc' },
        include: { service: true, user: true },
      });
    }

    return this.prisma.appointment.findMany({
      where: { userId },
      orderBy: { date: 'asc' },
      include: { service: true },
    });
  }

  async findOne(id: number, userId: number, role: 'CLIENT' | 'PROVIDER' | 'ADMIN') {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true } },
        service: { select: { id: true, name: true, providerId: true } },
      },
    });

    if (!appointment) {
      throw new NotFoundException('Agendamento não encontrado');
    }

    if (role === 'ADMIN') return appointment;

    const isOwner = appointment.userId === userId;
    const isProvider = appointment.service.providerId === userId;

    if (!isOwner && !isProvider) {
      throw new ForbiddenException('Acesso negado ao agendamento.');
    }

    return appointment;
  }

  async update(id: number, userId: number, dto: UpdateAppointmentDto) {
    const appointment = await this.prisma.appointment.findUnique({ where: { id } });

    if (!appointment) {
      throw new NotFoundException('Agendamento não encontrado.');
    }

    if (appointment.userId !== userId) {
      throw new ForbiddenException('Você não pode alterar este agendamento.');
    }

    return this.prisma.appointment.update({
      where: { id },
      data: { date: new Date(dto.date) },
    });
  }

  async cancel(id: number, userId: number) {
    const appointment = await this.prisma.appointment.findUnique({ where: { id } });

    if (!appointment) {
      throw new NotFoundException('Agendamento não encontrado.');
    }

    const now = new Date();
    const limit = new Date(appointment.date);
    limit.setHours(limit.getHours() - 24);

    if (now > limit) {
      throw new BadRequestException('Cancelamento só é permitido com no mínimo 24h de antecedência.');
    }

    if (appointment.userId !== userId) {
      throw new ForbiddenException('Você não pode cancelar este agendamento.');
    }

    return this.prisma.appointment.update({
      where: { id },
      data: { status: 'CANCELED' },
    });
  }

  async reschedule(id: number, providerId: number, newDate: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
      include: {
        service: true,
      },
    });

    if (!appointment) {
      throw new NotFoundException('Agendamento não encontrado.');
    }

    if (appointment.service.providerId !== providerId) {
      throw new ForbiddenException('Você não pode remarcar este agendamento.');
    }

    const now = new Date();
    const appointmentDate = new Date(appointment.date);
    const limit = new Date(appointmentDate);
    limit.setHours(limit.getHours() - 24);

    if (now > limit) {
      throw new BadRequestException('Só é possível remarcar com pelo menos 24h de antecedência.');
    }

    return this.prisma.appointment.update({
      where: { id },
      data: {
        date: new Date(newDate),
        status: 'PENDING',
      },
    });
  }

  async updateStatusAsProvider(id: number, providerId: number, dto: UpdateStatusDto) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
      include: { service: true },
    });

    if (!appointment) {
      throw new NotFoundException('Agendamento não encontrado.');
    }

    if (appointment.service.providerId !== providerId) {
      throw new ForbiddenException('Você não tem permissão para alterar este agendamento.');
    }

    const diff = appointment.date.getTime() - Date.now();
    const hoursDiff = diff / (1000 * 60 * 60);
    if (dto.status === 'CANCELED' && hoursDiff < 24) {
      throw new ForbiddenException('Cancelamento só é permitido até 24h antes do horário agendado.');
    }

    return this.prisma.appointment.update({
      where: { id },
      data: { status: dto.status },
    });
  }

  async findByProvider(providerId: number) {
    return this.prisma.appointment.findMany({
      where: { service: { providerId } },
      include: {
        user: { select: { id: true, name: true, email: true } },
        service: { select: { id: true, name: true } },
      },
      orderBy: { date: 'asc' },
    });
  }
}
