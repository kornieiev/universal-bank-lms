import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entity/user.entity';
import { Course } from './course.entity';

@Entity()
export class Enrollment {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.enrollments, { eager: false })
  user!: User;

  @ManyToOne(() => Course, (course) => course.enrollments, { eager: true })
  course!: Course;

  @CreateDateColumn()
  enrolledAt!: Date;

  @Column({ type: 'int', default: 0 })
  progress!: number;

  @Column({ type: 'timestamp', nullable: true })
  completedAt?: Date;
}
