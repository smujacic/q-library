import { registerAs } from '@nestjs/config';

export default registerAs('postgres-db', () => ({
  type: 'postgres',
  host: process.env.POSTGRES_DB_HOST,
  port: parseInt(process.env.POSTGRES_DB_PORT),
  username: process.env.POSTGRES_DB_USERNAME,
  password: process.env.POSTGRES_DB_PASSWORD,
  database: process.env.POSTGRES_DB_NAME,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  logging: process.env.NODE_ENV === 'development' ? true : false,
  synchronize: false,
  migrtions: [__dirname + '/../../database/migrations/*{.ts,.js}'],
}));
