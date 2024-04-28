import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ormConfig } from './common/configs/orm.config';
import { RedisClientModule } from './core/redis-client/redis-client.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { FileModule } from './modules/file/file.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync(ormConfig),
    RedisClientModule,
    AuthModule,
    UserModule,
    FileModule,
  ],
})
export class AppModule {}
