import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './entity/book.entity';
import { BooksController } from './books.controller';
import { JwtService } from '@nestjs/jwt';
import { BooksService } from './books.service';
import { User } from '../auth/entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Book, User])],
  providers: [JwtService, BooksService],
  controllers: [BooksController],
})
export class BooksModule {}
