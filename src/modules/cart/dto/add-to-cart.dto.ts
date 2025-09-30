import { IsNotEmpty, IsUUID, IsInt, Min } from 'class-validator';

export class AddToCartDto {
  @IsNotEmpty()
  @IsUUID()
  productId: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  quantity: number;
}
