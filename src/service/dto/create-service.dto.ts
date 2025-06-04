import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateServiceDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  description: string;

  @IsString()
  category: string;

  @IsString()
  availableDays: string;

  @IsString()
  dailyHours: string;

  @IsString()
  duration: string;

  @IsString()
  attendanceType: string;

  @IsString()
  location: string;

  @IsString()
  cep: string;

  @IsString()
  neighborhood: string;

  @IsString()
  city: string;

  @IsString()
  contact: string;

  @IsNumber()
  price: number;

  @IsString()
  paymentMethod: string;

  @IsString()
  image: string;
}
