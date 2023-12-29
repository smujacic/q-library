import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

import { UsersResponse } from './swagger/users-response';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LoggedInUser } from 'src/books/author.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/signeup')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create new user',
    tags: ['Users'],
  })
  @ApiBody({
    examples: {
      createUser: {
        value: {
          email: 'example@example.org',
          firstname: 'Jon',
          lastname: '',
          password: 'A0B1C2D!',
        },
      },
    },
    type: CreateUserDto,
  })
  @ApiBadRequestResponse(UsersResponse.badRequest)
  async signeUp(
    @LoggedInUser() author: { email: string; role: string },
    @Body() createUserPayload: CreateUserDto,
  ): Promise<void> {
    return this.usersService.createUser(author, createUserPayload);
  }

  @Post('/signin')
  @ApiOperation({
    summary: 'Login',
    tags: ['Users'],
  })
  @ApiBody({
    examples: {
      createUser: {
        value: {
          email: 'example@example.org',
          password: 'A0B1C2D!',
        },
      },
    },
    type: AuthCredentialsDto,
  })
  @ApiResponse({
    schema: { type: 'object', properties: { accessToken: { type: 'string' } } },
  })
  async signIn(
    @Body() authCredentialsPayload: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.usersService.signIn(authCredentialsPayload);
  }

  @Patch('/:id/user-status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'User status update',
    tags: ['Users'],
  })
  @ApiBody({
    examples: {
      createUser: {
        value: {
          status: false,
        },
      },
    },
    type: AuthCredentialsDto,
  })
  async changeUserStatus(
    @LoggedInUser() author: { email: string; role: string },
    @Param('id') id: string,
    @Body() payload: { status: boolean },
  ): Promise<void> {
    const { status } = payload;
    return this.usersService.changeUserStatus(author, id, status);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete user',
    tags: ['Users'],
  })
  async deleteUser(
    @LoggedInUser() author: { email: string; role: string },
    @Param('id') id: string,
  ) {
    return this.usersService.deleteUser(author, id);
  }
}
