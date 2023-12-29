import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { LoggedInUser } from './author.decorator';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { Book } from './entity/book.entity';
import { RoleEnum } from 'src/auth/enum/roles.enum';
import { UpdateBookDto } from './dto/update-book.dto';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post('')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create new book',
    tags: ['Book'],
  })
  @ApiBody({
    examples: {
      createBook: {
        value: {
          title: 'Harry Potter',
          pagesNumber: 220,
          publicationDate: '2023-12-01',
          genre: 'Fantasy',
        },
      },
    },
    type: CreateBookDto,
  })
  async createBook(
    @LoggedInUser() author: { email: string; role: string },
    @Body() bookData: CreateBookDto,
  ): Promise<Book> {
    return this.booksService.createBook(author, bookData);
  }

  @Get('')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all books',
    tags: ['Book'],
  })
  async getBooks(
    @LoggedInUser() author: { email: string; role: string },
  ): Promise<Book[]> {
    if (author.role === RoleEnum.ADMIN) {
      return this.booksService.getAllBooks();
    } else {
      return this.booksService.getAuthorBooks(author);
    }
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get book',
    tags: ['Book'],
  })
  async getBook(
    @LoggedInUser() author: { email: string; role: string },
    @Param('id') id: string,
  ): Promise<Book> {
    if (author.role === RoleEnum.ADMIN) {
      return this.booksService.getBook(id);
    } else {
      return this.booksService.getAuthorBook(author, id);
    }
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete book',
    tags: ['Book'],
  })
  async deleteBook(
    @LoggedInUser() author: { email: string; role: string },
    @Param('id') id: string,
  ): Promise<Book> {
    if (author.role === RoleEnum.ADMIN) {
      return this.booksService.deleteBook(id);
    } else {
      return this.booksService.deleteAuthorBook(author, id);
    }
  }

  @Put('/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update book',
    tags: ['Book'],
  })
  async updateBook(
    @LoggedInUser() author: { email: string; role: string },
    @Param('id') id: string,
    @Body() updateBookPayload: UpdateBookDto,
  ): Promise<Book> {
    if (author.role === RoleEnum.ADMIN) {
      return this.booksService.updateBook(id, updateBookPayload);
    } else {
      return this.booksService.updateAuthorBook(author, id, updateBookPayload);
    }
  }
}
