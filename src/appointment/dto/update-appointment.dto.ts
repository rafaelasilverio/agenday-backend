import { IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAppointmentDto {
  @ApiProperty({
    example: '2025-07-01T14:00:00Z',
    description: 'Nova data/hora do agendamento no formato ISO',
  })
  @IsDateString()
  date: string;
}
