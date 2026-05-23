import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Enrollment } from '../../courses/entity/enrollment.entity';
import { UserRole } from '../interfaces/user-role.interface';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Index({ unique: true })
  @Column()
  email!: string;

  @Index()
  @Column()
  password!: string;

  @Column({ default: 0 })
  coins!: number;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role?: string;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @OneToMany(() => Enrollment, (enrollment) => enrollment.user)
  enrollments?: Enrollment[];
}
