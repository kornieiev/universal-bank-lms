import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Enrollment } from '../courses/entity/enrollment.entity';
import { AuthModule } from '../auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { authConfig } from '../auth/config/auth.config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    TypeOrmModule.forFeature([User, Enrollment]),
    forwardRef(() => AuthModule),
    ConfigModule.forFeature(authConfig),
    JwtModule.registerAsync(authConfig.asProvider()),
  ],
  exports: [UsersService],
})
export class UsersModule {}
