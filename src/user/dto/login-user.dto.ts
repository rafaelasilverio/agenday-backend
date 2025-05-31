import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({ example: 'usuario@email.com', description: 'E-mail do usuário' })
  email: string;

  @ApiProperty({ example: 'senha123', description: 'Senha do usuário' })
  password: string;
}
