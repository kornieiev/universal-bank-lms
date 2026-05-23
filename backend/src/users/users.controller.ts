import {
  Body,
  Controller,
  forwardRef,
  Get,
  Inject,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import { ActiveUser } from '../auth/decorators/active-user.decorator';

@Controller('users')
export class UsersController {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,

    private readonly configService: ConfigService,
  ) {}

  @Get()
  public async getAllUsers() {
    return await this.usersService.getAllUsers();
  }

  @Get('me/courses')
  public async getMyCources(@ActiveUser('sub') userId: number) {
    return await this.usersService.getMyCourses(userId);
  }

  @Post()
  public async createUser(@Body() createUserDto: CreateUserDto) {
    await this.usersService.createUser(createUserDto);
  }
}
