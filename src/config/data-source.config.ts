import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

let dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: String(process.env.DB_PASS),
  database: process.env.DB_NAME,
  // entities: isProduction ? ['dist/**/*.entity.js'] : ['src/**/*.entity.ts'],
  // migrations: isProduction ? ['dist/database/migrations/*.js']: ['src/database/migrations/*.ts'],
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/database/migrations/*.js'],
};

if (process.env.DB_SSL === 'true') {
  dataSourceOptions = {
    ...dataSourceOptions,
    ssl: true,
    extra: { ssl: { rejectUnauthorized: false } },
  };
}

export const dataSource = new DataSource(dataSourceOptions);
