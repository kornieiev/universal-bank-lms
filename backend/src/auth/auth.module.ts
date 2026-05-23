import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from '../users/entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HashingProvider } from './provider/hashing.provider';
import { BcriptProvider } from './provider/bcript.provider';
import { UsersModule } from '../users/users.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { authConfig } from './config/auth.config';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: HashingProvider,
      useClass: BcriptProvider,
    },
  ],
  exports: [HashingProvider],
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => UsersModule),
    ConfigModule.forFeature(authConfig),
    JwtModule.registerAsync(authConfig.asProvider()),
  ],
})
export class AuthModule {}
