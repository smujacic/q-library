import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Role } from './entity/role.entity';
import { UsersService } from './users.service';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';

@Module({
  providers: [UsersService, JwtStrategy],
  controllers: [AuthController],
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        global: true,
        signOptions: { expiresIn: configService.get('JWT_TOKEN_EXPIRES') },
      }),
    }),
    TypeOrmModule.forFeature([User, Role]),
  ],
  exports: [JwtStrategy, PassportModule, UsersService],
})
export class AuthModule {}
