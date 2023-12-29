import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateBookDto {
  @ApiProperty({
    required: true,
    example: 'Harry Potter',
  })
  @IsString()
  @MinLength(3)
  @IsOptional()
  title?: string;

  @ApiProperty({
    required: false,
    example: 220,
  })
  @IsOptional()
  pagesNumber?: number;

  @ApiProperty({
    required: true,
    example: '2023-12-01',
  })
  @IsDateString()
  @IsOptional()
  publicationDate?: Date;

  @ApiProperty({
    required: false,
    example: 'Fantasy',
  })
  @IsOptional()
  genre?: string;
}
