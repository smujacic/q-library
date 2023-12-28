import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

config();

const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  host: configService.get('POSTGRES_DB_HOST'),
  port: configService.get('POSTGRES_DB_PORT'),
  username: configService.get('POSTGRES_DB_USERNAME'),
  password: configService.get('POSTGRES_DB_PASSWORD'),
  database: configService.get('POSTGRES_DB_NAME'),
  entities: [`${__dirname}/../src/**/*.entity{.ts,.js}`],
  synchronize: false,
  logging: configService.get('NODE_ENV') === 'development' ? true : false,
  migrations: [`${__dirname}/migrations/*{.ts,.js}`],
});
