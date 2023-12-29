import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './entity/book.entity';
import { Repository } from 'typeorm';
import { CreateBookDto } from './dto/create-book.dto';
import { User } from '../auth/entity/user.entity';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book) private readonly bookRepository: Repository<Book>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  /**
   *
   * @param author
   * @param createBookPayload
   * @returns
   */
  async createBook(
    author: { email: string; role: string },
    createBookPayload: CreateBookDto,
  ): Promise<Book> {
    const { title, pagesNumber, publicationDate, genre } = createBookPayload;
    let book: Book = null;

    try {
      const getAuthor: User = await this.userRepository.findOneBy({
        email: author.email,
      });

      book = this.bookRepository.create({
        title,
        author: getAuthor,
        pagesNumber,
        publicationDate,
        genre,
      });

      book = await this.bookRepository.save(book);
    } catch (error) {
      throw new InternalServerErrorException();
    }

    return book;
  }

  /**
   *
   * @returns
   */
  async getAllBooks(): Promise<Book[]> {
    const books = this.bookRepository.find();

    if (!books) throw new NotFoundException();

    return books;
  }

  /**
   *
   * @param author
   * @returns
   */
  async getAuthorBooks(author: {
    email: string;
    role: string;
  }): Promise<Book[]> {
    const getAuthor: User = await this.userRepository.findOneBy({
      email: author.email,
    });

    const books = await this.bookRepository.find({
      where: { author: { id: getAuthor.id } },
    });

    if (!books)
      throw new NotFoundException(
        `Books for atuhor ${author.email} doesn't exist`,
      );

    return books;
  }

  /**
   *
   * @param id
   * @returns
   */
  async getBook(id: string): Promise<Book> {
    const book = this.bookRepository.findOneBy({ id });

    if (!book) throw new NotFoundException(`Book with id ${id} doesn't exist`);

    return book;
  }

  /**
   *
   * @param author
   * @param id
   * @returns
   */
  async getAuthorBook(
    author: {
      email: string;
      role: string;
    },
    id: string,
  ): Promise<Book> {
    const getAuthor: User = await this.userRepository.findOneBy({
      email: author.email,
    });

    if (!getAuthor)
      throw new NotFoundException(`Author ${author.email} doesn't exist`);

    const book = await this.bookRepository.findOne({
      where: { author: { id: getAuthor.id }, id: id },
    });

    if (!book) throw new NotFoundException(`Book with id ${id} doesn't exist`);

    return book;
  }

  /**
   *
   * @param id
   * @returns
   */
  async deleteBook(id: string): Promise<Book> {
    const book = await this.bookRepository.findOneBy({ id });

    if (!book) throw new NotFoundException(`Book with id ${id} doesn't exist`);

    return this.bookRepository.remove(book);
  }

  /**
   *
   * @param author
   * @param id
   * @returns
   */
  async deleteAuthorBook(
    author: {
      email: string;
      role: string;
    },
    id: string,
  ): Promise<Book> {
    const getAuthor: User = await this.userRepository.findOneBy({
      email: author.email,
    });

    if (!getAuthor)
      throw new NotFoundException(`Author ${author.email} doesn't exist`);

    const book = await this.bookRepository.findOne({
      where: { author: { id: getAuthor.id }, id: id },
    });

    if (!book) throw new NotFoundException(`Book with id ${id} doesn't exist`);

    return this.bookRepository.remove(book);
  }

  /**
   *
   * @param id
   * @param updateBookPayload
   * @returns
   */
  async updateBook(
    id: string,
    updateBookPayload: CreateBookDto,
  ): Promise<Book> {
    const { title, genre, publicationDate } = updateBookPayload;

    const book = await this.bookRepository.findOneBy({ id });

    if (!book) throw new NotFoundException(`Book with id ${id} doesn't exist`);

    const updatedBook = this.bookRepository.create({
      ...book,
      title,
      genre,
      publicationDate,
    });

    return this.bookRepository.save(updatedBook);
  }

  /**
   *
   * @param author
   * @param id
   * @param updateBookPayload
   * @returns
   */
  async updateAuthorBook(
    author: {
      email: string;
      role: string;
    },
    id: string,
    updateBookPayload: CreateBookDto,
  ): Promise<Book> {
    const { title, genre, publicationDate } = updateBookPayload;

    const getAuthor: User = await this.userRepository.findOneBy({
      email: author.email,
    });

    if (!getAuthor)
      throw new NotFoundException(`Author ${author.email} doesn't exist`);

    const book = await this.bookRepository.findOne({
      where: { author: { id: getAuthor.id }, id: id },
    });

    if (!book) throw new NotFoundException(`Book with id ${id} doesn't exist`);

    const updatedBook = this.bookRepository.create({
      ...book,
      title,
      genre,
      publicationDate,
    });

    return this.bookRepository.remove(updatedBook);
  }
}
