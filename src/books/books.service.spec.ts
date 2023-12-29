import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from './books.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../auth/entity/user.entity';
import { Book } from './entity/book.entity';
import { RoleEnum } from '../auth/enum/roles.enum';
import { NotFoundException } from '@nestjs/common';

const mockUserRepository = {
  findOneBy: jest.fn(async (email: string) => {
    if (email === mockAuthor.email) {
      return mockUser;
    }

    if (email === null) {
      throw new NotFoundException();
    }
  }),
};

const mockUser = {
  id: 'test id',
  email: 'test#test.org',
  firstname: 'Test',
  lastname: 'Test',
  password: 'Test12345',
  isActive: true,
  role: RoleEnum.AUTHOR,
};

const mockAuthor = {
  email: 'author@test.org',
  role: RoleEnum.AUTHOR,
};

const mockBookRepository = {
  save: jest.fn(async (book: Book) => {
    return { ...book };
  }),
};

const mockBook: Book = {
  id: 'test-id',
  title: 'Test title',
  pagesNumber: 200,
  publicationDate: new Date(),
  genre: 'Test',
  author: new User(),
};

describe('BookService', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let booksService: BooksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
        { provide: getRepositoryToken(Book), useValue: mockBookRepository },
      ],
    }).compile();

    booksService = module.get<BooksService>(BooksService);
  });

  describe('createBook', () => {
    it('calls UserRepository.findOneBy', async () => {
      const result = await mockUserRepository.findOneBy(mockAuthor.email);
      expect(result).toEqual(mockUser);
    });

    it('calls UserRepository.findOneBy and handle error', async () => {
      await expect(mockUserRepository.findOneBy(null)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('callse BooksRepository.save', async () => {
      const result = await mockBookRepository.save(mockBook);
      expect(result).toEqual(mockBook);
    });
  });
});
