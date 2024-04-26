import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { dataSourceOptions } from './database.config';
export const ormConfig: TypeOrmModuleAsyncOptions = {
  imports: [],
  useFactory: () => {
    return {
      ...dataSourceOptions,
      synchronize: false,
    };
  },
  inject: [],
};
