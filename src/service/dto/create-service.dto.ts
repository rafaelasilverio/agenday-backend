import { IsString, IsNotEmpty, IsNumber, IsArray } from 'class-validator';

export class CreateServiceDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  description: string;

  @IsString()
  category: string;

  @IsArray()
  @IsString({ each: true })
  availableDays: string[];

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

  @IsString()
  dataInicio?: string;

  @IsString()
  dataFim?: string;
}
