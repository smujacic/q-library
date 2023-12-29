import { User } from '../../auth/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Book {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @ManyToOne(() => User, (user) => user.books, { eager: true })
  author: User;

  @Column()
  pagesNumber: number;

  @CreateDateColumn({ type: 'date' })
  publicationDate: Date;

  @Column()
  genre: string;
}
