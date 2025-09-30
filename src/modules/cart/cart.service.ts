import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
  ForbiddenException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { AddToCartDto, UpdateCartItemDto, ListPaidCartsDto } from './dto';
import { Cart, CartStatus } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { Product } from '../products/entities/product.entity';
import { User, UserRole } from '../users/entities/user.entity';

@Injectable()
export class CartService {
  private cartRepository: Repository<Cart>;
  private cartItemRepository: Repository<CartItem>;
  private productRepository: Repository<Product>;

  constructor(
    @Inject('DataSource')
    private dataSource: DataSource,
  ) {
    this.cartRepository = dataSource.getRepository(Cart);
    this.cartItemRepository = dataSource.getRepository(CartItem);
    this.productRepository = dataSource.getRepository(Product);
  }

  async addToCart(userId: string, addToCartDto: AddToCartDto) {
    const { productId, quantity } = addToCartDto;

    // Verificar se o produto existe
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });
    if (!product) throw new NotFoundException('Product not found');

    // Verificar se há um carrinho OPEN para o usuário
    let cart = await this.cartRepository.findOne({
      where: { userId, status: CartStatus.OPEN },
      relations: ['items'],
    });

    if (!cart) {
      // Criar novo carrinho
      cart = this.cartRepository.create({ userId });
      await this.cartRepository.save(cart);
    }

    // Verificar se o produto já está no carrinho
    let cartItem = cart.items.find((item) => item.productId === productId);

    if (cartItem) {
      // Atualizar quantidade
      cartItem.quantity += quantity;
      await this.cartItemRepository.save(cartItem);
    } else {
      // Adicionar novo item
      cartItem = this.cartItemRepository.create({
        cartId: cart.id,
        productId,
        quantity,
        price: product.price,
      });
      await this.cartItemRepository.save(cartItem);
    }

    return await this.getCartById(cart.id, userId);
  }

  async getCart(userId: string) {
    const cart = await this.cartRepository.findOne({
      where: { userId, status: CartStatus.OPEN },
      relations: ['items', 'items.product'],
    });

    if (!cart) throw new NotFoundException('No open cart found');

    return cart;
  }

  async updateCartItem(
    userId: string,
    cartItemId: string,
    updateDto: UpdateCartItemDto,
  ) {
    const cartItem = await this.cartItemRepository.findOne({
      where: { id: cartItemId },
      relations: ['cart'],
    });

    if (!cartItem) throw new NotFoundException('Cart item not found');
    if (cartItem.cart.userId !== userId)
      throw new ForbiddenException('Access denied');
    if (cartItem.cart.status !== CartStatus.OPEN)
      throw new BadRequestException('Cart is not open');

    if (updateDto.quantity !== undefined) {
      if (updateDto.quantity <= 0) {
        // Remover item se quantidade <= 0
        await this.cartItemRepository.delete(cartItemId);
      } else {
        cartItem.quantity = updateDto.quantity;
        await this.cartItemRepository.save(cartItem);
      }
    }

    return await this.getCartById(cartItem.cartId, userId);
  }

  async removeCartItem(userId: string, cartItemId: string) {
    const cartItem = await this.cartItemRepository.findOne({
      where: { id: cartItemId },
      relations: ['cart'],
    });

    if (!cartItem) throw new NotFoundException('Cart item not found');
    if (cartItem.cart.userId !== userId)
      throw new ForbiddenException('Access denied');
    if (cartItem.cart.status !== CartStatus.OPEN)
      throw new BadRequestException('Cart is not open');

    await this.cartItemRepository.delete(cartItemId);

    return await this.getCartById(cartItem.cartId, userId);
  }

  async closeCart(userId: string) {
    const cart = await this.cartRepository.findOne({
      where: { userId, status: CartStatus.OPEN },
    });

    if (!cart) throw new NotFoundException('No open cart found');

    cart.status = CartStatus.CLOSED;
    await this.cartRepository.save(cart);

    return cart;
  }

  async payCart(userId: string) {
    const cart = await this.cartRepository.findOne({
      where: { userId, status: CartStatus.OPEN },
      relations: ['items'],
    });

    if (!cart) throw new NotFoundException('No open cart found');

    // Calcular total
    const total = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    cart.totalValue = total;
    cart.status = CartStatus.PAID;

    await this.cartRepository.save(cart);

    return cart;
  }

  async listPaidCarts(user: User, listDto: ListPaidCartsDto) {
    if (user.role !== UserRole.ADMIN)
      throw new ForbiddenException('Access denied');

    const where: any = { status: CartStatus.PAID };
    if (listDto.userId) {
      where.userId = listDto.userId;
    }

    return await this.cartRepository.find({
      where,
      relations: ['user', 'items', 'items.product'],
      order: { createdAt: 'DESC' },
    });
  }

  private async getCartById(cartId: string, userId: string) {
    const cart = await this.cartRepository.findOne({
      where: { id: cartId, userId },
      relations: ['items', 'items.product'],
    });

    if (!cart) throw new NotFoundException('Cart not found');

    return cart;
  }
}
