import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { UsersModule, AuthModule, ProductsModule, CartModule } from './modules';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    AuthModule,
    ProductsModule,
    CartModule,
  ],
})
export class AppModule {}
