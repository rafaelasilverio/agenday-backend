import {
  Controller,
  Get,
  Put,
  Body,
  UseGuards,
  Request,
  HttpCode,
  UnauthorizedException,
  Delete,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  /**
   * GET /users/profile
   * Retorna os dados do perfil do usuário autenticado.
   */
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    const userId = this.extractUserId(req.user);
    return this.userService.getProfile(userId);
  }

  /**
   * PUT /users/profile
   * Atualiza os dados do perfil (name, email, phone e senha opcionalmente).
   */
  @UseGuards(JwtAuthGuard)
  @Put('profile')
  @HttpCode(200)
  async updateProfile(@Request() req, @Body() dto: UpdateUserDto) {
    const userId = this.extractUserId(req.user);
    return this.userService.updateProfile(userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('profile')
  @HttpCode(200)
  async deleteProfile(@Request() req) {
    const userId = this.extractUserId(req.user);
    return this.userService.deleteProfile(userId);
  }

  /**
   * GET /users
   * Somente ADMIN: lista todos os usuários.
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  /**
   * Garante que extraímos o ID correto do objeto `req.user`,
   * que pode vir como `id`, `userId` ou `sub` dependendo da estratégia JWT.
   */
  private extractUserId(user: any): number {
    const raw = user.id ?? user.userId ?? user.sub;
    const id = typeof raw === 'string' ? parseInt(raw, 10) : raw;
    if (typeof id !== 'number' || isNaN(id)) {
      throw new UnauthorizedException('Token inválido: userId ausente');
    }
    return id;
  }
}
