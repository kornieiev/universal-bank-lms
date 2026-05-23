import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Course } from './src/courses/entity/course.entity';
import { Enrollment } from './src/courses/entity/enrollment.entity';
import { User } from './src/users/entity/user.entity';

dotenv.config({ path: '.env.development' });

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, Course, Enrollment],
  migrations: ['migrations/*.{ts,js}'],
});