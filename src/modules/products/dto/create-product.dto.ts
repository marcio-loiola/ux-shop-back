import { IsNotEmpty, IsOptional, IsPositive } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  description?: string;

  @IsNotEmpty()
  @IsPositive()
  price: number;
}
