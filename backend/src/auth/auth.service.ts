import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { HashingProvider } from './provider/hashing.provider';
import type { ConfigType } from '@nestjs/config';
import { authConfig } from './config/auth.config';
import { User } from '../users/entity/user.entity';
import { ActiveUserType } from './interfaces/active-user-type.interface';
import { refreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly hashingProvider: HashingProvider,

    @Inject(authConfig.KEY)
    private readonly authConfiguration: ConfigType<typeof authConfig>,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<any> {
    if (createUserDto.password !== createUserDto.password_confirmation) {
      throw new BadRequestException('Password confirmation does not match');
    }

    const user = await this.userService.createUser(createUserDto);

    const token = await this.generateToken(user);

    return {
      user: {
        id: user.id,
        name: user.name,
        coins: user.coins,
      },
      token,
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.userService.findUserByEmail(loginDto.email);

    let isEqual: boolean = false;

    isEqual = await this.hashingProvider.comparePassword(
      loginDto.password,
      user.password,
    );

    if (!isEqual) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = await this.generateToken(user);


    return {
      user: {
        id: user.id,
        name: user.name,
        coins: user.coins,
      },
      token,
    };
  }

  private async signToken<T>(userId: number, expiresIn: number, payload?: T) {
    return await this.jwtService.signAsync({
        sub: userId,
        ...payload,
      },
      {
        secret: this.authConfiguration.secret,
        expiresIn,
        audience: this.authConfiguration.audience,
        issuer: this.authConfiguration.issuer,
      },
    );
  }

  private async generateToken(user: User) {
    const accessToken = await this.signToken<Partial<ActiveUserType>>(
      user.id,
      this.authConfiguration.expiresIn,
      { email: user.email },
    );

    const refreshToken = await this.signToken(
      user.id,
      this.authConfiguration.refreshExpiresIn,
    );

    return {
      token: accessToken,
      refreshToken,
    };
  }

  public async refreshToken(refreshTokenDto: refreshTokenDto) {
    try {
      const { sub } = await this.jwtService.verifyAsync<{ sub: number }>(
        refreshTokenDto.refreshToken,
        {
          secret: this.authConfiguration.secret,
          audience: this.authConfiguration.audience,
          issuer: this.authConfiguration.issuer,
        },
      );

      const user = await this.userService.findUserById(sub);

      return await this.generateToken(user);
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
