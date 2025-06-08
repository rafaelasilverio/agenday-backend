import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) { }

  /**
   * Cria um novo usuário (usado no /auth/register).
   */
  async create(data: any) {
    try {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      const user = await this.prisma.user.create({
        data: {
          ...data,
          password: hashedPassword,
          role: data.role ?? 'CLIENT',
        },
      });
      return { id: user.id, email: user.email };
    } catch (error: any) {
      if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
        throw new ConflictException('Este e-mail já está cadastrado.');
      }
      throw error;
    }
  }

  /**
   * Busca usuário por e-mail (usado internamente no AuthService).
   */
  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  /**
   * Lista todos os usuários (GET /users) — só ADMIN.
   */
  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });
  }

  /**
   * Retorna o perfil de um usuário por ID.
   */
  async getProfile(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, phone: true },
    });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }
    return user;
  }

  /**
   * Atualiza perfil: name, email, phone e troca de senha opcional.
   */
  async updateProfile(userId: number, dto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    const updateData: any = {
      name: dto.name ?? user.name,
      email: dto.email ?? user.email,
      phone: dto.phone ?? user.phone,
    };

    // Se informou troca de senha, valida e altera
    if (dto.newPassword) {
      if (!dto.currentPassword) {
        throw new UnauthorizedException(
          'Para trocar a senha, informe a senha atual e a nova senha.',
        );
      }
      const senhaValida = await bcrypt.compare(
        dto.currentPassword,
        user.password,
      );
      if (!senhaValida) {
        throw new UnauthorizedException('Senha atual incorreta.');
      }
      updateData.password = await bcrypt.hash(dto.newPassword, 10);
    }

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: { id: true, name: true, email: true, phone: true },
    });

    return updated;
  }

  async deleteProfile(userId: number) {
    // 1) apaga todos os agendamentos feitos por ele
    await this.prisma.appointment.deleteMany({
      where: { userId }
    });

    // 2) pega todos os serviços que ele oferece
    const services = await this.prisma.service.findMany({
      where: { providerId: userId },
      select: { id: true }
    });
    const serviceIds = services.map(s => s.id);

    // 3) apaga todos os agendamentos desses serviços
    if (serviceIds.length) {
      await this.prisma.appointment.deleteMany({
        where: { serviceId: { in: serviceIds } }
      });
    }

    // 4) apaga os próprios serviços
    await this.prisma.service.deleteMany({
      where: { providerId: userId }
    });

    // 5) só então apaga o usuário
    await this.prisma.user.delete({
      where: { id: userId }
    });

    return { message: 'Conta excluída com sucesso.' };
  }

}
