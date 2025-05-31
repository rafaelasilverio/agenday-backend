import { IsEmail, IsOptional, IsString, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'João da Silva', description: 'Nome completo do usuário' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'joao@email.com', description: 'E-mail válido e único' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'senha123', description: 'Senha segura para autenticação' })
  @IsString()
  password: string;

  @ApiPropertyOptional({ example: '11999999999', description: 'Telefone de contato' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    example: 'PROVIDER',
    description: 'Papel do usuário no sistema',
    enum: ['CLIENT', 'PROVIDER', 'ADMIN'],
  })
  @IsOptional()
  @IsIn(['CLIENT', 'PROVIDER', 'ADMIN'])
  role?: 'CLIENT' | 'PROVIDER' | 'ADMIN';
}
