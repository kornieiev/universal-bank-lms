import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './entity/course.entity';
import { Enrollment } from './entity/enrollment.entity';
import { User } from '../users/entity/user.entity';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [CoursesController],
  providers: [CoursesService],
  imports: [TypeOrmModule.forFeature([Course, Enrollment, User]), UsersModule],
})
export class CoursesModule {}
