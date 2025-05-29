import { IsString, IsDateString, IsInt } from 'class-validator';

export class CreateAppointmentDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsDateString()
  date: string;

  @IsInt()
  serviceId: number;
}
