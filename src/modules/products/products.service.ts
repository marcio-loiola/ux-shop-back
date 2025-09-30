import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { CreateProductDto, UpdateProductDto } from './dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  private productsRepository: Repository<Product>;

  constructor(
    @Inject('DataSource')
    private dataSource: DataSource,
  ) {
    this.productsRepository = dataSource.getRepository(Product);
  }

  async create(createProductDto: CreateProductDto) {
    const product = this.productsRepository.create(createProductDto);
    return await this.productsRepository.save(product);
  }

  async findAll() {
    return await this.productsRepository.find({});
  }

  async findOne(id: string) {
    const product = await this.productsRepository.findOne({ where: { id } });

    if (!product) throw new NotFoundException(`Product not found`);

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productsRepository.findOne({ where: { id } });
    if (!product) throw new NotFoundException(`Product not found`);

    const updatedProduct = await this.productsRepository.preload({
      id,
      ...updateProductDto,
    });

    return await this.productsRepository.save(updatedProduct);
  }

  async remove(id: string) {
    const product = await this.productsRepository.findOne({ where: { id } });
    if (!product) throw new NotFoundException(`Product not found`);

    return await this.productsRepository.delete(id);
  }
}
