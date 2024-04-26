import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config();
export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [join(__dirname, '../../**/*.entity{.js,.ts}')],
  migrations: [join(__dirname, '../../migrations/*{.js,.ts}')],
};
const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
