import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

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

  async findAll(
    userId: number,
    role: 'CLIENT' | 'PROVIDER' | 'ADMIN',
  ) {
    if (role === 'ADMIN') {
      return this.prisma.appointment.findMany({
        orderBy: { date: 'asc' },
        include: {
          service: true,
          user: true,
        },
      });
    }

    return this.prisma.appointment.findMany({
      where: { userId },
      orderBy: { date: 'asc' },
      include: {
        service: true,
      },
    });
  }

  async update(id: number, userId: number, dto: UpdateAppointmentDto) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
    });

    if (!appointment) {
      throw new NotFoundException('Agendamento não encontrado.');
    }

    if (appointment.userId !== userId) {
      throw new ForbiddenException(
        'Você não pode alterar este agendamento.',
      );
    }

    return this.prisma.appointment.update({
      where: { id },
      data: {
        date: new Date(dto.date),
      },
    });
  }

  async cancel(id: number, userId: number) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
    });

    if (!appointment) {
      throw new NotFoundException('Agendamento não encontrado.');
    }

    if (appointment.userId !== userId) {
      throw new ForbiddenException(
        'Você não pode cancelar este agendamento.',
      );
    }

    return this.prisma.appointment.update({
      where: { id },
      data: { status: 'CANCELED' },
    });
  }
}
