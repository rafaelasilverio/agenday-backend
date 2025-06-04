import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

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
    } catch (error) {
      if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
        throw new ConflictException('Este e-mail já está cadastrado.');
      }
      throw error;
    }
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

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
}
