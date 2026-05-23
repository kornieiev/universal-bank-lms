import 'reflect-metadata';
import * as dotenv from 'dotenv';
import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import { Course } from '../src/courses/entity/course.entity';
import { Enrollment } from '../src/courses/entity/enrollment.entity';
import { User } from '../src/users/entity/user.entity';

dotenv.config({ path: '.env.development' });

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, Course, Enrollment],
  migrations: [],
});

const courses = [
  {
    title: 'AML Awareness Q2',
    description: 'Навчальний курс з AML і compliance',
    duration: '2h',
    required: true,
  },
  {
    title: 'Phishing & Social Engineering 2026',
    description: 'Практика захисту від фішингу та соціальної інженерії',
    duration: '45m',
    required: true,
  },
  {
    title: 'AI Copilot для банкіра',
    description: 'Практичний курс з Copilot та AI у банківській справі',
    duration: '3h',
    required: false,
  },
  {
    title: 'Customer Service Excellence',
    description: 'Покращення обслуговування клієнтів в банку',
    duration: '1.5h',
    required: false,
  },
  {
    title: 'Data Privacy & Security',
    description: 'Основи захисту даних і інформаційної безпеки',
    duration: '90m',
    required: true,
  },
];

const users = [
  { name: 'Богдан Хмельницький', email: 'bohdan@example.com', password: 'Pass1234!' },
  { name: 'Тарас Шевченко', email: 'taras@example.com', password: 'Pass1234!' },
  { name: 'Леся Українка', email: 'lesia@example.com', password: 'Pass1234!' },
  { name: 'Олена Коваль', email: 'olena.koval@example.com', password: 'Pass1234!' },
  { name: 'Іван Петров', email: 'ivan.petrov@example.com', password: 'Pass1234!' },
  { name: 'Марія Шевченко', email: 'maria.shevchenko@example.com', password: 'Pass1234!' },
  { name: 'Сергій Кравченко', email: 'sergiy.kravchenko@example.com', password: 'Pass1234!' },
  { name: 'Наталія Білан', email: 'natalia.bilan@example.com', password: 'Pass1234!' },
  { name: 'Олександр Гордієнко', email: 'oleksandr.gordienko@example.com', password: 'Pass1234!' },
  { name: 'Тетяна Левченко', email: 'tetyana.levchenko@example.com', password: 'Pass1234!' },
  { name: 'Віктор Семенов', email: 'viktor.semenov@example.com', password: 'Pass1234!' },
  { name: 'Анна Романова', email: 'anna.romanova@example.com', password: 'Pass1234!' },
  { name: 'Микола Хмельницький', email: 'mykola.khmelnitsky@example.com', password: 'Pass1234!' },  
];

const enrollments = [
  { email: 'olena.koval@example.com', title: 'AML Awareness Q2', progress: 0, completedAt: new Date() },
  { email: 'ivan.petrov@example.com', title: 'Phishing & Social Engineering 2026', progress: 0, completedAt: new Date() },
  { email: 'maria.shevchenko@example.com', title: 'Customer Service Excellence', progress: 0, completedAt: new Date() },
  { email: 'sergiy.kravchenko@example.com', title: 'Data Privacy & Security', progress: 0 },
  { email: 'natalia.bilan@example.com', title: 'AI Copilot для банкіра', progress: 0 },
];

async function seed() {
  await dataSource.initialize();

  const courseRepo = dataSource.getRepository(Course);
  const userRepo = dataSource.getRepository(User);
  const enrollmentRepo = dataSource.getRepository(Enrollment);

  for (const course of courses) {
    await courseRepo.upsert(course, ['title']);
  }

  for (const user of users) {
    const existingUser = await userRepo.findOneBy({ email: user.email });

    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      await userRepo.save(
        userRepo.create({
          name: user.name,
          email: user.email,
          password: hashedPassword,
          coins: 0,
          role: 'user',
        }),
      );
    }
  }

  const allCourses = await courseRepo.find();
  const allUsers = await userRepo.find();

  for (const item of enrollments) {
    const user = allUsers.find((u) => u.email === item.email);
    const course = allCourses.find((c) => c.title === item.title);

    if (!user || !course) continue;

    const existing = await enrollmentRepo.findOne({
      where: {
        user: { id: user.id },
        course: { id: course.id },
      },
    });

    if (existing) continue;

    const enrollment = enrollmentRepo.create({
      user,
      course,
      progress: item.progress,
      completedAt: item.completedAt,
    });

    await enrollmentRepo.save(enrollment);

    user.coins += 10;
    await userRepo.save(user);
  }

  await dataSource.destroy();
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
