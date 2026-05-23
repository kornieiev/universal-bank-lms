import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Course } from './entity/course.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enrollment } from './entity/enrollment.entity';
import { User } from '../users/entity/user.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,

    @InjectRepository(Enrollment)
    private enrollmentRepository: Repository<Enrollment>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    private UsersService: UsersService
  ) {}

  public async findAll(): Promise<Course[]> {
    return this.courseRepository.find({
      select: {
        id: true,
        title: true,
        description: true,
        duration: true,
        required: true,
      },
    });
  }

  public async findOneById(courseId: number): Promise<Course> {
    const course = await this.courseRepository.findOne({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return course;
  }

  public async enrollCourse(userId: number, courseId: number) {
    const course = await this.findOneById(courseId);

    const existingEnrollment = await this.enrollmentRepository.findOne({
      where: {
        course: { id: courseId },
        user: { id: userId },
      },
    });

    if (existingEnrollment) {
      throw new ConflictException({
        message: 'Already enrolled in this course',
      });
    }

    const user = await this.UsersService.findUserById(userId);

    const enrollment = this.enrollmentRepository.create({
      course,
      user,
      progress: 0,
    });

    await this.enrollmentRepository.save(enrollment);

    user.coins += 10;
    await this.userRepository.save(user);

    return {
      message: 'Successfully enrolled',
      enrollment: {
        course_id: course.id,
        enrolled_at: enrollment.enrolledAt.toISOString(),
        progress: enrollment.progress,
      },
      coins_earned: 10,
      coins_total: user.coins,
    };
  }
}
