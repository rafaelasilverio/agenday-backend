import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum AppointmentStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELED = 'CANCELED',
}

export class UpdateStatusDto {
  @ApiProperty({
    enum: AppointmentStatus,
    example: AppointmentStatus.CONFIRMED,
    description: 'Novo status do agendamento',
  })
  @IsEnum(AppointmentStatus)
  status: AppointmentStatus;
}
