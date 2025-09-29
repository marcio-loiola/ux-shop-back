import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { UsersModule, AuthModule } from './modules';

@Module({
  imports: [ConfigModule.forRoot(), UsersModule, AuthModule],
})
export class AppModule {}
