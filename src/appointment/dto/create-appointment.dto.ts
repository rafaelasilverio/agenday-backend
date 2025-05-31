import { IsString, IsDateString, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAppointmentDto {
  @ApiProperty({ example: 'Consulta com nutricionista' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Avaliação de dieta e plano alimentar' })
  @IsString()
  description: string;

  @ApiProperty({
    example: '2025-06-30T10:00:00Z',
    description: 'Data e hora do agendamento no formato ISO',
  })
  @IsDateString()
  date: string;

  @ApiProperty({ example: 1, description: 'ID do serviço que será agendado' })
  @IsInt()
  serviceId: number;
}
