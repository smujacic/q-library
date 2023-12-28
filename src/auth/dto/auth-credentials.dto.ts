import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class AuthCredentialsDto {
  @ApiProperty({
    description: 'This must be valide email address',
    required: true,
    example: 'example@example.org',
  })
  @IsString()
  @Matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
    message: 'This is not valid email address',
  })
  email: string;

  @ApiProperty({
    description:
      'Password needs to have at least one small letter, one big letter and one number',
    minLength: 8,
    maxLength: 32,
    required: true,
  })
  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Need to have one big letter, small letter and number.',
  })
  password: string;
}
