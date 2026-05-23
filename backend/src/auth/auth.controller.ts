import {
  Body,
  Controller,
  forwardRef,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { AllowAnonymous } from './decorators/allow-anonymous.decorator';
import { refreshTokenDto } from './dto/refresh-token.dto';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  @AllowAnonymous()
  @Post('register')
  public async register(@Body() createUserDto: CreateUserDto): Promise<any> {
    return await this.authService.register(createUserDto);
  }

  @AllowAnonymous()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  public async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  @AllowAnonymous()
  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  public async refreshToken(@Body() refreshTokenDto: refreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto);
  }
}
