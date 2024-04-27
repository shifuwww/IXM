import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ormConfig } from './common/configs/orm.config';
import { RedisClientModule } from './core/redis-client/redis-client.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync(ormConfig),
    RedisClientModule,
    AuthModule,
  ],
})
export class AppModule {}
