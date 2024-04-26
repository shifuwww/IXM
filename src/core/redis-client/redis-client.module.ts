import { Module, Global } from '@nestjs/common';
import { RedisClientService } from './redis-client.service';

@Global()
@Module({
  controllers: [],
  providers: [RedisClientService],
  exports: [RedisClientService],
})
export class RedisClientModule {}
