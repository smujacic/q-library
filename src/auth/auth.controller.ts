import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
} from '@nestjs/swagger';
import { RoleEnum } from './enum/roles.enum';
import { UsersResponse } from './swagger/users-response';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Roles } from './roles.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/signeup')
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
          role: RoleEnum.AUTHOR,
        },
      },
    },
    type: CreateUserDto,
  })
  @ApiBadRequestResponse(UsersResponse.badRequest)
  async signeUp(@Body() createUserPayload: CreateUserDto): Promise<void> {
    return this.usersService.createUser(createUserPayload);
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
  async signIn(
    @Body() authCredentialsPayload: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.usersService.signIn(authCredentialsPayload);
  }

  @Get('/test')
  @UseGuards(JwtAuthGuard)
  @Roles(RoleEnum.AUTHOR)
  @ApiBearerAuth()
  test(): string {
    return 'ok';
  }
}
