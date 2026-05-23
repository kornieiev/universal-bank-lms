import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { HashingProvider } from '../auth/provider/hashing.provider';
import { UserRank } from './interfaces/user-rank.interface';
import { Enrollment } from '../courses/entity/enrollment.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    // @Inject(forwardRef(() => HashingProvider))
    private readonly hashingProvider: HashingProvider,

    @InjectRepository(Enrollment)
    private enrollmentRepository: Repository<Enrollment>,
  ) {}

  async createUser(userDto: CreateUserDto) {
    if (userDto.password !== userDto.password_confirmation) {
      throw new BadRequestException('Password confirmation does not match');
    }

    const existingUser = await this.userRepository.findOne({
      where: { email: userDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email is already registered');
    }

    const hashedPassword = await this.hashingProvider.hashPassword(
      userDto.password,
    );

    const { password_confirmation, ...rest } = userDto;
    const newUser = this.userRepository.create({
      ...rest,
      password: hashedPassword,
      coins: 0,
      role: rest['role'] ?? 'user',
    });

    try {
      return await this.userRepository.save(newUser);
    } catch (error) {
      throw new InternalServerErrorException(
        'Unable to create user. Please try again later.',
      );
    }
  }

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.find({
      select: {
        id: true,
        name: true,
        email: true,
        coins: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findUserByEmail(email: string) {
    let user: User | null = null;

    try {
      user = await this.userRepository.findOneBy({ email });
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'User with given username could not be found',
      });
    }

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  public async findUserById(userId: number) {
    let user: User | null = null;

    try {
      user = await this.userRepository.findOne({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          coins: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Unable to load user by id',
      });
    }

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  public async getTopTenUsers(): Promise<UserRank[]> { // TODO: Change return type
    return await this.userRepository
      .createQueryBuilder('user')
      .leftJoin(
        'user.enrollments',
        'enrollment',
        'enrollment.completedAt IS NOT NULL',
      )
      .select(['user.id AS id', 'user.name AS name', 'user.coins AS coins'])
      .addSelect('COUNT(enrollment.id)', 'courses_completed')
      .groupBy('user.id')
      .orderBy('user.coins', 'DESC')
      .limit(10)
      .getRawMany();
  }

  public async getMyCourses(userId: number) {
    const enrollments = await this.enrollmentRepository.find({
      where: { user: { id: userId } },
      relations: { course: true },
      order: { enrolledAt: 'DESC' },
    });

    return enrollments.map((enrollment) => ({
      course_id: enrollment.course.id,
      title: enrollment.course.title,
      progress: enrollment.progress,
      enrolled_at: enrollment.enrolledAt.toISOString(),
      completed_at: enrollment.completedAt?.toISOString() ?? null,
    }));
  }
}
