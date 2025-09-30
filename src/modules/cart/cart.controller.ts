import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UseGuards,
  Query,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { instanceToInstance } from 'class-transformer';

import { CartService } from './cart.service';
import { AddToCartDto, UpdateCartItemDto, ListPaidCartsDto } from './dto';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('cart')
@UseGuards(AuthGuard('jwt'))
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add')
  async addToCart(@Request() req, @Body() addToCartDto: AddToCartDto) {
    const cart = await this.cartService.addToCart(req.user.id, addToCartDto);
    return instanceToInstance(cart);
  }

  @Get()
  async getCart(@Request() req) {
    const cart = await this.cartService.getCart(req.user.id);
    return instanceToInstance(cart);
  }

  @Patch('item/:cartItemId')
  async updateCartItem(
    @Request() req,
    @Param('cartItemId', new ParseUUIDPipe()) cartItemId: string,
    @Body() updateDto: UpdateCartItemDto,
  ) {
    const cart = await this.cartService.updateCartItem(
      req.user.id,
      cartItemId,
      updateDto,
    );
    return instanceToInstance(cart);
  }

  @Delete('item/:cartItemId')
  async removeCartItem(
    @Request() req,
    @Param('cartItemId', new ParseUUIDPipe()) cartItemId: string,
  ) {
    const cart = await this.cartService.removeCartItem(req.user.id, cartItemId);
    return instanceToInstance(cart);
  }

  @Post('close')
  async closeCart(@Request() req) {
    const cart = await this.cartService.closeCart(req.user.id);
    return instanceToInstance(cart);
  }

  @Post('pay')
  async payCart(@Request() req) {
    const cart = await this.cartService.payCart(req.user.id);
    return instanceToInstance(cart);
  }

  @Get('paid')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async listPaidCarts(@Request() req, @Query() query: ListPaidCartsDto) {
    const carts = await this.cartService.listPaidCarts(req.user, query);
    return instanceToInstance(carts);
  }
}
