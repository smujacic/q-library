import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entity/role.entity';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { RoleEnum } from './enum/roles.enum';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  private logger = new Logger('User Service', { timestamp: true });

  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Import roles if they doesn't exist
   */
  async createRole(): Promise<void> {
    const roles = [RoleEnum.ADMIN, RoleEnum.AUTHOR];

    for (const role of roles) {
      const existingRole: Role = await this.roleRepository.findOneBy({
        name: role,
      });

      this.logger.verbose(`createRole method: existingRole ${existingRole}`);

      if (!existingRole) {
        try {
          const newRole: Role = this.roleRepository.create({ name: role });
          await this.roleRepository.save(newRole);
        } catch (error) {
          this.logger.error(`createRole method: ${JSON.stringify(error)}`);
          throw new InternalServerErrorException(error.message || error);
        }
      }
    }
  }

  /**
   * Create superadmin user
   */
  async createSuperAdmin(): Promise<void> {
    const existingSuperAdmin: User = await this.userRepository.findOneBy({
      email: this.configService.get('SUPERADMIN_EMAIL'),
    });

    this.logger.verbose(
      `createSuperAdmin method: existingSuperAdmin ${existingSuperAdmin}`,
    );

    if (!existingSuperAdmin) {
      this.createUser(
        {
          role: RoleEnum.ADMIN,
          email: this.configService.get('SUPERADMIN_EMAIL'),
        },
        {
          role: RoleEnum.ADMIN,
          email: this.configService.get('SUPERADMIN_EMAIL'),
          firstname: this.configService.get('SUPERADMIN_FIRSTNAME'),
          password: this.configService.get('SUPERADMIN_PASSWORD'),
        },
      );
    }
  }

  /**
   *
   * Create new user
   *
   * @param createUserPayload
   */
  async createUser(
    author: { email: string; role: string },
    createUserPayload: CreateUserDto,
  ): Promise<void> {
    if (author.role === RoleEnum.AUTHOR) throw new UnauthorizedException();

    const { email, firstname, role, lastname, password } = createUserPayload;

    const getRole: Role = await this.roleRepository.findOneBy({
      name: role ? role : RoleEnum.AUTHOR,
    });

    this.logger.verbose(`createUser method: role ${JSON.stringify(role)}`);

    try {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);

      const superadmin: User = this.userRepository.create({
        email,
        firstname,
        lastname,
        password: hashedPassword,
        role: getRole,
        isActive: true,
      });

      await this.userRepository.save(superadmin);
    } catch (error) {
      this.logger.error(`createUser method: ${JSON.stringify(error)}`);
      throw new InternalServerErrorException(error.message || error);
    }
  }

  /**
   *
   * @param authCredentialsPayload
   * @returns
   */
  async signIn(
    authCredentialsPayload: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { email, password } = authCredentialsPayload;

    const user: User = await this.userRepository.findOneBy({ email });

    this.logger.verbose(`signIn method: user ${JSON.stringify(user)}`);

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload = { email, role: user.roleName };
      const accessToken: string = this.jwtService.sign(payload, {
        expiresIn: this.configService.get('JWT_TOKEN_EXPIRES'),
        secret: this.configService.get('JWT_SECRET'),
      });

      return { accessToken };
    } else {
      throw new UnauthorizedException();
    }
  }

  /**
   *
   * @param author
   * @param id
   * @param status
   * @returns
   */
  async changeUserStatus(
    author: { email: string; role: string },
    id: string,
    status: boolean,
  ): Promise<void> {
    if (author.role === RoleEnum.AUTHOR) {
      const user: User = await this.userRepository.findOne({
        where: { id, email: author.email },
      });

      if (!user) throw new NotFoundException();

      user.isActive = status;
      this.userRepository.save(user);

      return;
    }

    const user: User = await this.userRepository.findOneBy({ id });

    if (!user) throw new NotFoundException();

    user.isActive = status;
    this.userRepository.save(user);

    return;
  }

  /**
   *
   * @param author
   * @param id
   * @returns
   */
  async deleteUser(
    author: { email: string; role: string },
    id: string,
  ): Promise<void> {
    if (author.role === RoleEnum.ADMIN) {
      const user: User = await this.userRepository.findOneBy({ id });

      if (!user) throw new NotFoundException();

      if (user.roleName === RoleEnum.ADMIN && user.isActive) {
        throw new ForbiddenException();
      }

      this.userRepository.remove(user);

      return;
    }

    throw new UnauthorizedException();
  }
}
