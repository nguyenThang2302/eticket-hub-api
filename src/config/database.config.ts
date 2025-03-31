import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { config as dotenvConfig } from 'dotenv';
import { SeederOptions } from 'typeorm-extension';

dotenvConfig({ path: '.env' });

const config: TypeOrmModuleOptions & SeederOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT || 3306,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/database/migrations/*{.ts,.js}'],
  subscribers: ['dist/**/*.subscriber{.ts,.js}'],
  autoLoadEntities: true,
  seeds: ['dist/database/seeds/*.js'],
  factories: ['dist/database/factories/*.js'],
};

export const dataSource = new DataSource(config as DataSourceOptions);

export default registerAs('database', () => config);
