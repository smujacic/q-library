import {
  MiddlewareConsumer,
  Module,
  NestModule,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configurationValidationSchema } from './configuration/config.schema';
import { DatabaseConfig } from './configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersService } from './auth/users.service';
import { BooksModule } from './books/books.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: configurationValidationSchema,
      isGlobal: true,
      load: [DatabaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ...configService.get('postgres-db'),
      }),
    }),
    AuthModule,
    BooksModule,
  ],
})
export class AppModule implements OnApplicationBootstrap, NestModule {
  constructor(private readonly usersService: UsersService) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.usersService.createRole();
    await this.usersService.createSuperAdmin();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  configure(_consumer: MiddlewareConsumer) {}
}
