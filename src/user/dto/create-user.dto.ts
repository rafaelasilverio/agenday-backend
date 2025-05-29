import { IsEmail, IsOptional, IsString, IsIn } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsIn(['CLIENT', 'PROVIDER', 'ADMIN']) // 👈 só aceita valores válidos
  role?: 'CLIENT' | 'PROVIDER' | 'ADMIN';
}