import { IsOptional, IsUUID } from 'class-validator';

export class ListPaidCartsDto {
  @IsOptional()
  @IsUUID()
  userId?: string;
}
